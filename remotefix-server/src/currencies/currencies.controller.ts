import {
  Controller,
} from '@nestjs/common';
import { CurrencyService } from './currencies.service';

@Controller('currencies')
export class CurrencyController {
  constructor(private readonly currenciesService: CurrencyService) {}
}
