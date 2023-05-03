import express, { Express } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import logger from '../cli/reporter'
import { ConfigModule } from '../types/globals'

type Options = {
  app: Express
  configModule?: ConfigModule
}

export default async function ({ app, configModule }: Options) {
  app.set('trust proxy', 1)
  app.use(express.json())
  app.use(helmet())
  app.use(
    morgan('combined', {
      stream: logger.loggerInstance_.stream,
      skip: () => process.env.NODE_ENV === 'test' || !configModule?.projectConfig?.http_logging,
    }),
  )

  app.get('/health', (req, res) => {
    res.status(200).send('OK')
  })

  return app
}
