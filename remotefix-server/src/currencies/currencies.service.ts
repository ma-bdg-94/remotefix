import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from './currencies.entity';
import { LessThan, Repository } from 'typeorm';
import { CurrencyTemplate, currencies } from './currencies.utils';
import { subDays } from 'date-fns';
import { BaseService } from 'src/base/base.service';

@Injectable()
export class CurrencyService extends BaseService<Currency> {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {
    super(currencyRepository)
  }
}
