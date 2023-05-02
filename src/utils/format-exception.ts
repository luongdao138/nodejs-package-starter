import { ZodError } from 'zod'

import { AppError, GlobalError } from '../common'

export enum PostgresError {
  DUPLICATE_ERROR = '23505',
  FOREIGN_KEY_ERROR = '23503',
  SERIALIZATION_FAILURE = '40001',
  NULL_VIOLATION = '23502',
}

/**
 * Format error before return to user
 * @param err Error object to convert to standardized app error
 * @returns Standardized app error
 */
export function formatException(err: GlobalError): AppError {
  let message = err.message ?? 'Unknown error occured!'

  let type: string

  if (err instanceof AppError || 'type' in err) {
    type = err.type as string
  } else if (err instanceof ZodError) {
    // validation error
    const zodFormattedError = err.issues
    type = AppError.Types.ZOD_ERROR
    message = zodFormattedError[0].message ?? 'Unknown error occured!'
  } else {
    type = AppError.Types.SERVER_ERROR
  }

  const formattedErr: AppError = new AppError(type, message)

  return { ...formattedErr, stack: err.stack }
}
