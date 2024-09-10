import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { convertToKB } from '@shared/utils/size-converter.util';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength: number = parseInt(res.get('content-length') || '0');
      this.logger.verbose(`${method} ${originalUrl} ${statusCode} ${convertToKB(contentLength)}`);
    });

    next();
  }
}
