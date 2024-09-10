import { LoggerService, LogLevel } from '@nestjs/common';
import * as chalk from 'chalk';
const nodeEnv = process.env.NODE_ENV;
const loggerLevel: LogLevel[] =
  nodeEnv === 'production' ? ['error', 'warn', 'log'] : ['error', 'warn', 'log', 'debug', 'verbose'];

export class CustomLogger implements LoggerService {
  private getTimestamp(): string {
    const now = new Date();
    // format to HH:MM:SS
    return now.toTimeString().split(' ')[0];
  }
  private getContextColor(level: LogLevel): chalk.Chalk {
    switch (level) {
      case 'log':
        return chalk.green;
      case 'error':
        return chalk.red;
      case 'warn':
        return chalk.yellow;
      case 'debug':
        return chalk.magenta;
      case 'verbose':
        return chalk.cyan;
    }
  }
  private getMessageColor(level: LogLevel): chalk.Chalk {
    switch (level) {
      case 'debug':
      case 'verbose':
        return chalk.dim;
      default:
        return chalk.reset;
    }
  }

  private formatMessage(message: any, context?: string, level: LogLevel = 'log'): string {
    const contextColor = this.getContextColor(level);
    const timestamp = chalk.dim.italic(`${this.getTimestamp()}`);
    const contextMessage = context ? contextColor(`[${context}] `) : '';
    const messageColor = this.getMessageColor(level);
    return `${timestamp} ${contextMessage}${messageColor(message)}`;
  }

  log(message: any, context?: string) {
    const verboseContexts: string[] = ['RouterExplorer', 'InstanceLoader', 'RoutesResolver'];
    if (verboseContexts.includes(context)) {
      this.verbose(message, context);
    } else {
      console.log(this.formatMessage(message, context, 'log'));
    }
  }

  error(message: any, trace?: string, context?: string) {
    console.error(this.formatMessage(message, context, 'error'));
    if (trace) {
      console.error(chalk.red(trace));
    }
  }

  warn(message: any, context?: string) {
    console.warn(this.formatMessage(message, context, 'warn'));
  }

  debug(message: any, context?: string) {
    console.debug(this.formatMessage(message, context, 'debug'));
  }

  verbose(message: any, context?: string) {
    console.log(this.formatMessage(message, context, 'verbose'));
  }
}
