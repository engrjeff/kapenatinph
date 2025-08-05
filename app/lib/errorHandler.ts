import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  field?: string;
}

export function handleActionError(error: unknown): ErrorResponse {
  console.log('Prisma Error: ', error);
  // Handle known Prisma errors
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint violation
        const model = (error?.meta?.modelName as string)?.toLowerCase() ?? '';

        const vowels = ['a', 'e', 'i', 'o', 'u'];

        const article = vowels.includes(model.charAt(0)) ? 'An' : 'A';

        const field = error.meta?.target as string[] | undefined;

        let fieldName = field?.[0];

        if (fieldName === 'userId') {
          if (field?.[1]) {
            fieldName = field?.[1];
          }
        }

        return {
          error: 'UNIQUE_CONSTRAINT_VIOLATION',
          message: `${article} ${model} record with this ${fieldName || 'value'} already exists`,
          statusCode: 409,
          field: fieldName,
        };

      case 'P2025':
        // Record not found
        return {
          error: 'RECORD_NOT_FOUND',
          message: 'The requested record was not found',
          statusCode: 404,
        };

      case 'P2003':
        // Foreign key constraint violation
        return {
          error: 'FOREIGN_KEY_CONSTRAINT',
          message: 'Cannot perform this operation due to related records',
          statusCode: 400,
        };

      case 'P2014':
        // Required relation violation
        return {
          error: 'REQUIRED_RELATION_VIOLATION',
          message: 'The change would violate a required relation',
          statusCode: 400,
        };

      case 'P2000':
        // Value too long for column
        return {
          error: 'VALUE_TOO_LONG',
          message: 'The provided value is too long for the field',
          statusCode: 400,
        };

      case 'P2006':
        // Invalid value for field
        return {
          error: 'INVALID_VALUE',
          message: 'The provided value is not valid for this field',
          statusCode: 400,
        };

      default:
        return {
          error: 'DATABASE_ERROR',
          message: error.message || 'A database error occurred',
          statusCode: 500,
        };
    }
  }

  // Handle validation errors
  if (error instanceof PrismaClientValidationError) {
    return {
      error: 'VALIDATION_ERROR',
      message: 'Invalid data provided to the database',
      statusCode: 400,
    };
  }

  // Handle initialization errors
  if (error instanceof PrismaClientInitializationError) {
    return {
      error: 'DATABASE_CONNECTION_ERROR',
      message: 'Unable to connect to the database',
      statusCode: 503,
    };
  }

  // Handle unknown Prisma errors
  if (error instanceof PrismaClientUnknownRequestError) {
    return {
      error: 'UNKNOWN_DATABASE_ERROR',
      message: 'An unknown database error occurred',
      statusCode: 500,
    };
  }

  // Handle Rust panic errors
  if (error instanceof PrismaClientRustPanicError) {
    return {
      error: 'DATABASE_PANIC',
      message: 'A critical database error occurred',
      statusCode: 500,
    };
  }

  // Handle generic errors
  if (error instanceof Error) {
    return {
      error: 'INTERNAL_ERROR',
      message: error.message || 'An internal error occurred',
      statusCode: 500,
    };
  }

  // Fallback for unknown error types
  return {
    error: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
    statusCode: 500,
  };
}
