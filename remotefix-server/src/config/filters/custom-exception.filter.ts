import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { APIResponse } from '../types/types';
import { ValidationError } from 'class-validator';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Determine the response status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const defaultMessage: string = 'An unexpected error occurred';

    let message: any = defaultMessage; // Initialize message

    // Handle validation errors
    if (exception instanceof HttpException && exception.getStatus() === HttpStatus.BAD_REQUEST) {
      const responseMessage: any = exception.getResponse();
      if (typeof responseMessage === 'object' && responseMessage.message) {
        message = responseMessage.message;
      } else {
        message = responseMessage;
      }
    } else if (exception instanceof HttpException) {
      const responseMessage: any = exception.getResponse();
      if (typeof responseMessage === 'object' && responseMessage.message) {
        message = responseMessage.message;
      } else {
        message = responseMessage;
      }
    }

    // Structure the response body
    const responseBody: APIResponse = {
      status,
      messages: Array.isArray(message) ? message : [message], // Ensure message is always an array
      data: null,
    };

    response.status(status).json(responseBody);
  }
}
