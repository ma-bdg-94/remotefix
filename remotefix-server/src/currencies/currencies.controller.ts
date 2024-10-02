import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { AddCurrencyDTO, UpdateCurrencyDTO } from './currencies.dto';
import { Currencies } from './currencies.entity';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Post('')
  async addCurrency(@Body() addCurrencyDTO: AddCurrencyDTO): Promise<Currencies> {
    return this.currenciesService.addOne(addCurrencyDTO);
  }

  @Get('')
  async getAllCurrencies(): Promise<Currencies[] | []> {
    return this.currenciesService.findAll();
  }

  @Get(':id')
  async getCurrencyById(@Param('id') id: number): Promise<Currencies | null> {
    return this.currenciesService.findOneById(id);
  }

  @Put(':id')
  async updateCurrency(
    @Param('id') id: number,
    updateCurrencyDTO: UpdateCurrencyDTO,
  ): Promise<Currencies | null> {
    return this.currenciesService.updateMultipleFields(id, updateCurrencyDTO);
  }

  @Patch('archive/:id')
  async toggleArchiveStatus(@Param('id') id: number): Promise<Currencies | null> {
    return this.currenciesService.toggleArchive(id);
  }

  @Patch('soft/:id')
  async softDeleteCountry(@Param('id') id: number): Promise<Currencies | null> {
    return this.currenciesService.softDelete(id);
  }

  @Delete(':id')
  async removeCurrency(@Param('id') id: number): Promise<void> {
    return this.currenciesService.remove(id);
  }
}
