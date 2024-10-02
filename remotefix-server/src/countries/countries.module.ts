import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { Countries } from './countries.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Countries])],
  providers: [CountriesService],
  controllers: [CountriesController],
})
export class CountriesModule {}
