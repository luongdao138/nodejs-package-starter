import { ZodError } from 'zod'

export const AppErrorTypeDict = {
  NOT_FOUND: 'not_found',
  UNAUTHORIZED: 'unauthorized',
  UNAUTHENTICATED: 'unauthenticated',
  BAD_REQUEST: 'bad_request',
  ZOD_ERROR: 'validation_error',
  DUPLICATE_ERROR: 'duplicate_error',
  SERVER_ERROR: 'server_error',
}

type AppErrorType = string
type AppErrorCode = string | number

export const AppErrorDict: { [key: string]: AppErrorCode } = {
  [AppErrorTypeDict.NOT_FOUND]: 404,
  [AppErrorTypeDict.UNAUTHORIZED]: 401,
  [AppErrorTypeDict.UNAUTHENTICATED]: 403,
  [AppErrorTypeDict.BAD_REQUEST]: 400,
  [AppErrorTypeDict.ZOD_ERROR]: 400,
  [AppErrorTypeDict.DUPLICATE_ERROR]: 422,
  [AppErrorTypeDict.SERVER_ERROR]: 500,
}

/**
 * Standardized error to be used across the project
 * @extends Error
 */
export class AppError extends Error {
  public type: AppErrorType
  public code: AppErrorCode
  public timestamp: string

  static Types = AppErrorTypeDict

  /**
   * Creates a standardized error to be used across project.
   * @param {string} type - type of error
   * @param {string} message - message to go along with error
   */
  constructor(type: AppErrorType, message: string) {
    super()

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }

    this.type = type
    this.code = AppErrorDict[type] ?? AppError[AppErrorTypeDict.SERVER_ERROR] // fallback to server error
    this.timestamp = new Date().toISOString()
    this.message = message
  }
}

export type GlobalError = AppError | ZodError | Error
