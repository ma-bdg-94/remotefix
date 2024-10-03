import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { APIResponse } from '../types/types';
import { ValidationError } from 'class-validator'; // Import ValidationError

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

    let message: string | string[] = defaultMessage; // Initialize message

    // Handle validation errors
    if (Array.isArray(exception?.response?.message)) {
      message = exception.response.message.map((err: ValidationError) => {
        return Object.values(err.constraints).join(', ');
      });
    } else if (exception instanceof HttpException) {
      message = exception.getResponse() as any;
    }

    // Structure the response body
    const responseBody: APIResponse = {
      status,
      message: Array.isArray(message) ? message : [message], // Ensure message is always an array
      data: null,
    };

    response.status(status).json(responseBody);
  }
}
