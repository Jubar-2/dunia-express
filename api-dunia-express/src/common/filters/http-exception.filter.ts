import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class CentralizedExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CentralizedExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const respObj = exceptionResponse as Record<string, any>;
        if (Array.isArray(respObj.message)) {
          errorMessage = respObj.message.join('; ');
        } else if (typeof respObj.message === 'string') {
          errorMessage = respObj.message;
        } else if (typeof respObj.error === 'string') {
          errorMessage = respObj.error;
        } else {
          errorMessage = exception.message;
        }
      } else if (typeof exceptionResponse === 'string') {
        errorMessage = exceptionResponse;
      } else {
        errorMessage = exception.message;
      }
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
      errorMessage = exception.message || 'Internal server error';
    } else {
      this.logger.error('Unknown exception thrown', exception);
    }

    response.status(status).json({
      success: false,
      error: errorMessage,
    });
  }
}
