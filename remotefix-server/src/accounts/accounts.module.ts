import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  Accounts } from './accounts.entity';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { Currencies } from 'src/currencies/currencies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ Accounts, Currencies])],
  providers: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule {}
