import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesController } from './addresses.controller';
import {  Addresses } from './addresses.entity';
import { Countries } from 'src/countries/countries.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ Addresses, Countries])],
  providers: [AddressesService],
  controllers: [AddressesController],
})
export class AddressesModule {}
