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
import { IndustriesService } from './industries.service';
import { InsertIndustryDTO, UpdateIndustryDTO } from './industries.dto';
import { Industries } from './industries.entity';

@Controller('industries')
export class IndustriesController {
  constructor(private readonly industriesService: IndustriesService) {}

  @Post('')
  async insertIndustry(
    @Body() addCurrencyDTO: InsertIndustryDTO,
  ): Promise<Industries> {
    return this.industriesService.insertOne(addCurrencyDTO);
  }

  @Get('')
  async getAllIndustries(): Promise<Industries[] | []> {
    return this.industriesService.findAll();
  }

  @Get(':id')
  async getCountryById(@Param('id') id: number): Promise<Industries | null> {
    return this.industriesService.findOneById(id);
  }

  @Patch('archive/:id')
  async toggleArchiveStatus(@Param('id') id: number): Promise<Industries | null> {
    return this.industriesService.toggleArchive(id);
  }

  @Patch('soft/:id')
  async softDeleteIndustry(@Param('id') id: number): Promise<Industries | null> {
    return this.industriesService.softDelete(id);
  }

  @Delete(':id')
  async removeIndustry(@Param('id') id: number): Promise<void> {
    return this.industriesService.remove(id);
  }
}
