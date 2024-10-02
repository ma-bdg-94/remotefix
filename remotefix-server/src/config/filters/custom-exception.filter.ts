import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { APIResponse, Multilanguage } from '../types/types';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const defaultMessage: string = 'An unexpected error occurred'
    

    const message: string =
      exception instanceof HttpException
        ? (exception.getResponse() as any).message || defaultMessage
        : defaultMessage;

    const responseBody: APIResponse = {
      status,
      message: exception,
      data: null,
    };

    response.status(status).json(responseBody);
  }
}
