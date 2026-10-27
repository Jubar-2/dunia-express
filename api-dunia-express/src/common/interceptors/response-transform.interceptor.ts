import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, StandardResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // Pass through if already standardized
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          typeof (data as Record<string, any>).success === 'boolean'
        ) {
          return data;
        }

        return {
          success: true,
          data: data ?? null,
        };
      }),
    );
  }
}
