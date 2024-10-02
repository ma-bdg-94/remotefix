import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { Currencies } from './currencies.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrenciesController } from './currencies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Currencies])],
  providers: [CurrenciesService],
  controllers: [CurrenciesController],
})
export class CurrenciesModule {}
