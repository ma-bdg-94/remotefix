import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CountriesService } from './countries.service';
import { Countries } from './countries.entity';
import { InsertCountryDTO, UpdateCountryDTO } from './countries.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post('')
  async insertCountry(
    @Body() addCurrencyDTO: InsertCountryDTO,
  ): Promise<Countries> {
    return this.countriesService.insertOne(addCurrencyDTO);
  }

  @Get('')
  async getAllCountries(): Promise<Countries[]> {
    return this.countriesService.findAll();
  }

  @Get(':id')
  async getCountryById(@Param('id') id: number): Promise<Countries | null> {
    return this.countriesService.findOneById(id);
  }

  @Put(':id')
  async updateCountry(
    @Param('id') id: number,
    updateCountryDTO: UpdateCountryDTO,
  ): Promise<Countries | null> {
    return this.countriesService.updateMultipleFields(id, updateCountryDTO);
  }

  @Patch('archive/:id')
  async toggleArchiveStatus(@Param('id') id: number): Promise<Countries | null> {
    return this.countriesService.toggleArchive(id);
  }

  @Patch('soft/:id')
  async softDeleteCountry(@Param('id') id: number): Promise<Countries | null> {
    return this.countriesService.softDelete(id);
  }

  @Delete(':id')
  async removeCountry(@Param('id') id: number): Promise<void> {
    return this.countriesService.remove(id);
  }
}
