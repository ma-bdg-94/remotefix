import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpStatus } from '@nestjs/common';
import { APIResponse } from '../types/types';

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        if (data && data.status && data.message && data.data) {
          data = data.data;
        }

        const apiResponse: APIResponse = {
          status: statusCode,
          message: 'Request was successful',
          data,
        };
        return apiResponse;
      }),
    );
  }
}
