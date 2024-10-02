import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currencies } from './currencies.entity';
import { LessThan, Repository } from 'typeorm';
import { CurrencyTemplate, currencies } from './currencies.utils';
import { subDays } from 'date-fns';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currencies)
    private currenciesRepository: Repository<Currencies>,
  ) {}

  private currencyAvailableCodes: string[] = currencies?.map(
    (currency: CurrencyTemplate) => currency?.isoCode,
  );

  private currencyAvailableSymbols: string[] = [
    ...new Set(
      currencies?.flatMap((currency: CurrencyTemplate) => [
        currency.symbol,
        currency.symbolNative,
      ]),
    ),
  ];

  async addOne(currencyData: Partial<Currencies>): Promise<Currencies> {
    const { name, isoCode, symbol } = currencyData;
    const existingCurrency = await this.currenciesRepository.findOneBy({
      isoCode,
    });

    if (existingCurrency) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        message: `Currencies with this ISO-4217 code ${isoCode} already exists in the database!`,
      });
    }

    // validations
    if (!name || !isoCode || !symbol) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: {
          en: `
              Could not add new currency, one or multiple datas are missing:
                ${!name && 'Name (Both in english and arabic).'}
                ${!isoCode && 'ISO-4217 code.'}
                ${!symbol && 'Symbol.'}
              `,
        },
      });
    }
    if (isoCode && !this.currencyAvailableCodes.includes(isoCode)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: {
          en: `Could not add new currency, ${isoCode} seems not a valid ISO-4217 code.`,
        },
      });
    }
    if (symbol && !this.currencyAvailableSymbols.includes(symbol)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: {
          en: `Could not create new currency, ${symbol} seems not a valid symbol.`,
        },
      });
    }

    const newCurrency = this.currenciesRepository.create(currencyData);

    return await this.currenciesRepository.save(newCurrency);
  }

  async findAll(): Promise<Currencies[]> {
    const currencyList = await this.currenciesRepository.find({
      where: { deleted: false },
      order: {
        isoCode: 'ASC',
      },
    });

    if (currencyList.length < 1) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: {
          en: 'No currency found in the database!',
        },
      });
    }

    return currencyList;
  }

  async findOneById(id: number): Promise<Currencies | null> {
    const currency = await this.currenciesRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (!currency) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: {
          en: `Could not find a currency with id = ${id} in the database.`,
        },
      });
    }

    return currency;
  }

  async updateMultipleFields(
    id: number,
    currencyData: Partial<Currencies>,
  ): Promise<Currencies | null> {
    const { isoCode, symbol } = currencyData;
    const currency = await this.currenciesRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (currency) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: {
          en: `Could not find a currency with id = ${id} in the database.`,
        },
      });
    }

    if (isoCode && !this.currencyAvailableCodes.includes(isoCode)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: {
          en: `Could not add new currency, ${isoCode} seems not a valid ISO-4217 code.`,
        },
      });
    }
    if (symbol && !this.currencyAvailableSymbols.includes(symbol)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: {
          en: `Could not create new currency, ${symbol} seems not a valid symbol.`,
        },
      });
    }

    const updatedCurrency = this.currenciesRepository.merge(
      currency,
      currencyData,
    );
    return await this.currenciesRepository.save(updatedCurrency);
  }

  async toggleArchive(id: number): Promise<Currencies | null> {
    const currency = await this.currenciesRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (currency) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: {
          en: `Could not find a currency with id = ${id} in the database.`,
        },
      });
    }

    currency['archived'] = !currency['archived'];
    return await this.currenciesRepository.save(currency);
  }

  async softDelete(id: number): Promise<Currencies | null> {
    const currency = await this.currenciesRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (currency) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: {
          en: `Could not find a currency with id = ${id} in the database.`,
        },
      });
    }

    currency['deleted'] = true;
    return await this.currenciesRepository.save(currency);
  }

  async remove(id: number): Promise<void> {
    const date_60_days_ago: Date = subDays(new Date(), 60);
    const currency = await this.currenciesRepository.findOne({
      where: {
        id,
        deleted: true,
        deleted_at: LessThan(date_60_days_ago),
      },
    });

    if (currency) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: {
          en: `Could not find a currency with id = ${id} in the database.`,
        },
      });
    }

    await this.currenciesRepository.delete(id);
  }
}
