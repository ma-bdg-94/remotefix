import { Module } from '@nestjs/common';
import { CurrencyService } from './currencies.service';
import { Currency } from './currencies.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyController } from './currencies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Currency])],
  providers: [CurrencyService],
  controllers: [CurrencyController],
})
export class CurrencyModule {}
