import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';

//import { nodeEnv } from '@common/constant/constant';

export interface CustomExceptionResponse {
  statusCode: number;
  message: string;
  error: string;
}
const errorMessages = {
  ERR0000: {
    code: 'ERR0000',
    message: 'Something went wrong. Please try again.',
  },
  ERR0001: {
    code: 'ERR0001',
    message: 'Access denied..!',
  },
};

@Catch(HttpException)
export class AllExceptionsFilter<T extends HttpException>
  implements ExceptionFilter
{
  private readonly logger = new Logger();

  /**
   * @description This method catches the exception and logs it to the console.
   * @param exception - The exception to catch.
   * @param host - The host to catch the exception.
   */
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    this.#logError(exception, request);
    const response = ctx.getResponse<Response>();
    const status = this.#getStatus(exception);
    this.#sendResponse(response, status, exception);
  }

  #getStatus(exception: T): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    /* else if (exception instanceof EntityNotFoundError) {
      return HttpStatus.NOT_FOUND;
    } else if (exception instanceof TypeORMError) {
      return HttpStatus.BAD_REQUEST;
    } */
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  #logError(exception: T, request: Request) {
    const { method, originalUrl, query, headers, params, body } = request;
    this.logger.error(`👽 ${method}:- ${originalUrl}`, `AllExceptionFilter`);
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv !== 'production') {
      this.logger.debug(JSON.stringify(exception), `AllExceptionFilter`);
    }
  }

  #sendResponse(response: Response, status: number, exception: T) {
    const message = exception.message;
    response.status(status).json({ message });
  }
}
