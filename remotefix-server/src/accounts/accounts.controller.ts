import {
  Controller,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { CustomExceptionFilter } from 'src/config/filters/custom-exception.filter';
import { SuccessResponseInterceptor } from 'src/config/interceptors/success_response.interceptor';
import { AccountService } from './accounts.service';

@UseFilters(CustomExceptionFilter)
@UseInterceptors(SuccessResponseInterceptor)
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
}
