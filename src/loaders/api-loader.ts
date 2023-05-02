import { Express } from 'express'

import initMasterRoute from '../api'
import { ConfigModule } from '../types'
import { AppContainer } from '../utils'

type Options = {
  container: AppContainer
  app: Express
}

export default async function ({ app, container }: Options) {
  const configModule = container.resolve<ConfigModule>('configModule')

  app.use('/api/v1', initMasterRoute(container, configModule))
}
