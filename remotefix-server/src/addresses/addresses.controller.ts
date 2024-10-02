import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { CustomExceptionFilter } from 'src/config/filters/custom-exception.filter';
import { SuccessResponseInterceptor } from 'src/config/interceptors/success_response.interceptor';
import { AddressesService } from './addresses.service';
import { AddAddressDTO, UpdateAddressDTO } from './addresses.dto';
import { Addresses } from './addresses.entity';

@UseFilters(CustomExceptionFilter)
@UseInterceptors(SuccessResponseInterceptor)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post('')
  async addAddress(@Body() addAddressDTO: AddAddressDTO): Promise<Addresses> {
    return this.addressesService.addOne(addAddressDTO);
  }

  @Get('')
  async getAddressList(): Promise<Addresses[]> {
    return this.addressesService.findAll();
  }

  @Get(':id')
  async getAddressById(@Param('id') id: number): Promise<Addresses | null> {
    return this.addressesService.findOneById(id);
  }

  @Patch('archive/:id')
  async toggleAddressArchive(
    @Param('id') id: number,
  ): Promise<Addresses | null> {
    return this.addressesService.toggleArchive(id);
  }

  @Put(':id')
  async updateAddress(
    @Param('id') id: number,
    @Body() updateAddressDTO: UpdateAddressDTO,
  ): Promise<Addresses | null> {
    return this.addressesService.updateMultipleFields(id, updateAddressDTO);
  }

  @Patch('delete/:id')
  async softDeleteAddress(@Param('id') id: number): Promise<Addresses | null> {
    return this.addressesService.softDelete(id);
  }

  @Delete(':id')
  async removeAddress(@Param('id') id: number): Promise<void> {
    return this.addressesService.remove(id);
  }
}
