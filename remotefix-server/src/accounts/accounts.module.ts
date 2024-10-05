import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './accounts.entity';
import { AccountService } from './accounts.service';
import { AccountController } from './accounts.controller';
import { Currency } from 'src/currencies/currencies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Currency])],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountsModule {}
