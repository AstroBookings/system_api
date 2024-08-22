import {
  Catch,
  HttpException,
  ExceptionFilter,
  Logger,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';
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

@Catch(HttpException, TypeORMError)
export class AllExceptionFilter<T extends HttpException | TypeORMError>
  implements ExceptionFilter
{
  private readonly logger = new Logger();

  #getStatus(exception: T): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    } else if (exception instanceof EntityNotFoundError) {
      return HttpStatus.NOT_FOUND;
    } else if (exception instanceof TypeORMError) {
      return HttpStatus.BAD_REQUEST;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  #logError(exception: T, request: Request) {
    const { method, originalUrl, query, headers, params, body } = request;
    this.logger.error(`${method}:- ${originalUrl}`, `AllExceptionFilter`);
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv !== 'production') {
      this.logger.debug(JSON.stringify(exception), `AllExceptionFilter`);
    }
  }

  #sendResponse(response: Response, status: number, exception: T) {
    const message = exception.message;
    response.status(status).json({ message });
  }

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = this.#getStatus(exception);
    this.#logError(exception, request);
    this.#sendResponse(response, status, exception);
  }
}
