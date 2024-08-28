/**
 * Represents the structure of a custom exception response.
 */
export type CustomExceptionResponse = {
  statusCode: number;
  message: string;
  error: string;
};

/**
 * Enum representing error codes used in the application.
 */
export enum ErrorCode {
  ERR0000 = 'ERR0000',
  ERR0001 = 'ERR0001',
}

/**
 * Type defining the structure of an error message.
 */
export type ErrorMessage = {
  code: ErrorCode;
  message: string;
};

/**
 * Constant object containing predefined error messages.
 */
export const ERROR_MESSAGES: Readonly<Record<ErrorCode, ErrorMessage>> = {
  [ErrorCode.ERR0000]: {
    code: ErrorCode.ERR0000,
    message: 'Something went wrong. Please try again.',
  },
  [ErrorCode.ERR0001]: {
    code: ErrorCode.ERR0001,
    message: 'Access denied..!',
  },
} as const;
