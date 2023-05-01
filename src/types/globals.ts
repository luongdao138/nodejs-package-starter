import { Express } from 'express'
import { LoggerOptions } from 'typeorm'

export type LoaderConfig = {
  directory: string
  expressApp: Express
  isTest?: boolean
}

export type LoaderResult = {
  app: Express
}

export type ConfigModule = {
  projectConfig: {
    redis_url?: string
    jwt_secret?: string
    cookie_secret?: string

    database_url?: string
    database_type: string
    database_database?: string
    database_schema?: string
    database_logging: LoggerOptions
    http_logging?: boolean

    database_extra?: Record<string, unknown> & {
      ssl: { rejectUnauthorized: false }
    }
    front_cors?: string
    admin_cors?: string
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
