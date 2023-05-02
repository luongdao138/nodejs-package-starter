/* eslint-disable @typescript-eslint/no-namespace */

import { Express } from 'express'
import { DatabaseType, LoggerOptions } from 'typeorm'
import { Logger as _Logger } from 'winston'

import { AppContainer } from '../utils'
declare global {
  namespace Express {
    interface Request {
      scope: AppContainer
      request_context: Record<string, any>
    }
  }
}

export type LoaderConfig = {
  directory: string
  expressApp: Express
  isTest?: boolean
}

export type LoaderResult = {
  app: Express
  container: AppContainer
}

export type ConfigModule = {
  projectConfig: {
    redis_url?: string
    jwt_secret?: string
    cookie_secret?: string

    database_url?: string
    database_type: DatabaseType
    database_database?: string
    database_schema?: string
    database_logging: LoggerOptions
    http_logging?: boolean

    database_extra?: Record<string, unknown> & {
      ssl: { rejectUnauthorized: false }
    }
    front_cors?: string
    admin_cors?: string
    port?: number
  }
  //   featureFlags: Record<string, boolean | string>
  //   modules?: Record<string, false | string | Partial<InternalModuleDeclaration | ExternalModuleDeclaration>>
  //   plugins: (
  //     | {
  //         resolve: string
  //         options: Record<string, unknown>
  //       }
  //     | string
  //   )[]
}

export type Logger = _Logger & {
  progress: (activityId: string, msg: string) => void
  info: (msg: string) => void
  warn: (msg: string) => void
}

export type ClassConstructor<T> = {
  new (...args: unknown[]): T
}
