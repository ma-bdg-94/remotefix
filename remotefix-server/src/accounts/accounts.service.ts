import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Accounts } from './accounts.entity';
import { LessThan, Repository } from 'typeorm';
import { Currencies } from 'src/currencies/currencies.entity';
import { subDays } from 'date-fns';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Accounts)
    private accountsRepository: Repository<Accounts>,
    @InjectRepository(Currencies)
    private currenciesRepository: Repository<Currencies>,
  ) {}

  async addOne(accountData: Partial<Accounts>): Promise<Accounts> {
    const {
      label,
      monthlyFee,
      currency,
      nbCompanies,
      nbWorkOrders,
      nbEmployees,
    } = accountData;

    // check duplicate
    const existingAccount = await this.accountsRepository.findOneBy({
      monthlyFee,
      deleted: false,
    });
    if (existingAccount) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        message: `We already have an active account with monthly fee ${monthlyFee} in the database.`,
      });
    }

    // check currency
    const currency_id = await this.currenciesRepository.findOneBy({
      id: currency.id,
    });
    if (!currency_id) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not found a currency with id ${currency_id} in the database.`,
      });
    }

    // validations
    if (!label || !monthlyFee || !nbCompanies || !nbWorkOrders || nbEmployees) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `
            Could not add new account, one or multiple datas are missing:
              ${!label && 'Label (Both in english and arabic).'}
              ${!monthlyFee && 'Monthly fee.'}
              ${!currency && 'Currency.'}
              ${!nbCompanies && 'Maximum number of allowed companies.'}
              ${!nbWorkOrders && 'Minimum and maximum number of allowed work orders (in the all companies).'}
              ${!nbEmployees && 'Minimum and maximum number of allowed employees (including all types in the all the companies).'}
            `,
      });
    }

    if (monthlyFee && isNaN(monthlyFee)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: `Monthly fee ${monthlyFee} submitted is not a valid number.`,
      });
    }

    if (nbCompanies && isNaN(nbCompanies)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: `Number of companies ${nbCompanies} submitted is not a valid number.`,
      });
    }

    if (nbWorkOrders && !nbWorkOrders.every((wo: any) => !isNaN(wo))) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: `At least one of the numbers of work orders ${nbWorkOrders} submitted is not a valid number.`,
      });
    }

    if (nbEmployees && !nbEmployees.every((e: any) => !isNaN(e))) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: `At least one of the Numbers of work orders ${nbEmployees} submitted is not a valid number.`,
      });
    }

    const newAccount = this.accountsRepository.create(accountData);
    newAccount['monthlyFee'] =
      typeof newAccount['monthlyFee'] === 'number'
        ? newAccount['monthlyFee']
        : parseFloat(newAccount['monthlyFee']);

    return await this.accountsRepository.save(newAccount);
  }

  async findAll(sortingDirection: string): Promise<Accounts[]> {
    const validDirections: ('ASC' | 'DESC')[] = ['ASC', 'DESC'];
    const direction: 'ASC' | 'DESC' = validDirections.includes(
      sortingDirection.toLocaleUpperCase() as 'ASC' | 'DESC',
    )
      ? (sortingDirection.toLocaleUpperCase() as 'ASC' | 'DESC')
      : 'ASC';

    const accountList = await this.accountsRepository.find({
      where: { deleted: false },
      order: {
        monthlyFee: direction,
      },
    });

    if (accountList.length < 1) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'No account found in the database!',
      });
    }

    return accountList;
  }

  async findOneById(id: number): Promise<Accounts | null> {
    const account = await this.accountsRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (!account) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find an account with id = ${id} in the database.`,
      });
    }

    return account;
  }

  async toggleArchive(id: number): Promise<Accounts | null> {
    const account = await this.accountsRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (!account) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find an account with id = ${id} in the database.`,
      });
    }

    account['archived'] = !account['archived'];
    return await this.accountsRepository.save(account);
  }

  async updateField(
    id: number,
    field: string,
    value: any,
  ): Promise<Accounts | null> {
    const account = await this.accountsRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (!account) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find an account with id = ${id} in the database.`,
      });
    }

    if (!account[field]) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Account does not contain field = ${field}.`,
      });
    }

    account[field] = value;
    return await this.accountsRepository.save(account);
  }

  async softDelete(id: number): Promise<Accounts | null> {
    const Accounts = await this.accountsRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (!Accounts) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find an  Accounts with id = ${id} in the database.`,
      });
    }

    Accounts['deleted'] = true;
    return await this.accountsRepository.save(Accounts);
  }

  async remove(id: number): Promise<void> {
    const date_60_days_ago: Date = subDays(new Date(), 60);
    const account = await this.accountsRepository.findOne({
      where: {
        id,
        deleted: true,
        deleted_at: LessThan(date_60_days_ago),
      },
    });

    if (!account) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find an account with id = ${id} in the database.`,
      });
    }

    await this.accountsRepository.delete(id);
  }
}
