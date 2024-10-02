import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { CustomExceptionFilter } from 'src/config/filters/custom-exception.filter';
import { SuccessResponseInterceptor } from 'src/config/interceptors/success_response.interceptor';
import { AccountsService } from './accounts.service';
import { AddAccountDTO, UpdateFieldDTO } from './accounts.dto';
import { Accounts } from './accounts.entity';

@UseFilters(CustomExceptionFilter)
@UseInterceptors(SuccessResponseInterceptor)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('')
  async addAccount(@Body() addAccountDTO: AddAccountDTO): Promise<Accounts> {
    return this.accountsService.addOne(addAccountDTO);
  }

  @Get('')
  async getAccountList(
    @Query('sortOrder') sort_order: string,
  ): Promise<Accounts[]> {
    return this.accountsService.findAll(sort_order);
  }

  @Get(':id')
  async getAccountById(@Param('id') id: number): Promise<Accounts | null> {
    return this.accountsService.findOneById(id);
  }

  @Patch('archive/:id')
  async toggleAccountArchive(
    @Param('id') id: number,
  ): Promise<Accounts | null> {
    return this.accountsService.toggleArchive(id);
  }

  @Patch('field/:id')
  async updateAccount(
    @Param('id') id: number,
    @Body() updateFieldDTO: UpdateFieldDTO,
  ): Promise<Accounts | null> {
    const { field, value } = updateFieldDTO;
    return this.accountsService.updateField(id, field, value);
  }

  @Patch('delete/:id')
  async softDeleteAccount(@Param('id') id: number): Promise<Accounts | null> {
    return this.accountsService.softDelete(id);
  }

  @Delete(':id')
  async removeAccount(@Param('id') id: number): Promise<void> {
    return this.accountsService.remove(id);
  }
}
