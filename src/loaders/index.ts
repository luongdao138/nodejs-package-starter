import 'reflect-metadata'

import { asValue } from 'awilix'
import { NextFunction, Request, Response } from 'express'
import { track } from 'medusa-telemetry'
import { EOL } from 'os'

import notFoundHandler from '../api/middlewares/not-found-handler'
import logger from '../cli/reporter'
import { LoaderConfig, LoaderResult } from '../types/globals'
import { AppContainer, createAppContainer } from '../utils'
import apiLoader from './api-loader'
import loadConfig from './config'
import databaseLoader from './database-loader'
import expressLoader from './express-loader'
import modelsLoader from './models-loader'
import pluginsLoader, { registerPluginModels } from './plugins-loader'
import redisLoader from './redis-loader'
import repositoresLoader from './repositores-loader'
import loadRequestContext from './request-context'
import servicesLoader from './services-loader'
import swaggerLoader from './swagger-loader'

const appLoader = async ({ expressApp, directory }: LoaderConfig): Promise<LoaderResult> => {
  const configModule = loadConfig(directory)

  // create app container (awilix DI)
  const container = createAppContainer()

  // register resolved config module to container
  container.register('configModule', asValue(configModule))
  track('Config module loaded')

  // add additional information to context of the request
  loadRequestContext(expressApp)
  track('Request context loaded')

  // feature flag here => currently not available

  // register logger and feature flag router
  container.register({
    logger: asValue(logger),
  })

  // register redis database
  await redisLoader({ container, configModule, logger: logger as any })
  track('Redis DB inited')

  // load all db models
  const modelsActivity = logger.activity(`Initializing models${EOL}`)
  track('MODELS_INIT_STARTED')
  await modelsLoader({ container })
  const mAct = logger.success(modelsActivity, 'Models initialized') || {}
  track('MODELS_INIT_COMPLETED', { duration: mAct.duration })

  // load all plugins's models
  const pmActivity = logger.activity(`Initializing plugin models${EOL}`)
  track('PLUGIN_MODELS_INIT_STARTED')
  await registerPluginModels({ container, rootDirectory: directory, configModule })
  const pmAct = logger.success(pmActivity, 'Plugin models initialized') || {}
  track('PLUGIN_MODELS_INIT_COMPLETED', { duration: pmAct.duration })

  // strategies loaders => currently not available

  // create datasource and connect to db
  // currently not support sqlite (use postgresql, mysql instead)
  const dbActivity = logger.activity(`Initializing database${EOL}`)
  track('DATABASE_INIT_STARTED')
  const dataSource = await databaseLoader({ container, configModule })
  const dbAct = logger.success(dbActivity, 'Database initialized') || {}
  track('DATABASE_INIT_COMPLETED', { duration: dbAct.duration })

  // load all internal repositories
  const repoActivity = logger.activity(`Initializing repositories${EOL}`)
  track('REPOSITORIES_INIT_STARTED')
  await repositoresLoader({ container })
  const rAct = logger.success(repoActivity, 'Repositories initialized') || {}
  track('REPOSITORIES_INIT_COMPLETED', { duration: rAct.duration })

  // register datasource to container
  container.register({
    manager: asValue(dataSource.manager),
  })

  // services loader
  const servicesActivity = logger.activity(`Initializing services${EOL}`)
  track('SERVICES_INIT_STARTED')
  await servicesLoader({ container, configModule })
  const servAct = logger.success(servicesActivity, 'Services initialized') || {}
  track('SERVICES_INIT_COMPLETED', { duration: servAct.duration })

  // load basic epxress app config
  const expActivity = logger.activity(`Initializing express${EOL}`)
  track('EXPRESS_INIT_STARTED')
  await expressLoader({ app: expressApp, configModule })
  // passport loader
  const exAct = logger.success(expActivity, 'Express intialized') || {}
  track('EXPRESS_INIT_COMPLETED', { duration: exAct.duration })

  // Add the registered services to the request scope
  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    container.register({ manager: asValue(dataSource.manager) })
    req.scope = container.createScope() as AppContainer
    next()
  })

  // plugins loader (only project plugin for now)
  const pluginsActivity = logger.activity(`Initializing plugins${EOL}`)
  track('PLUGINS_INIT_STARTED')
  await pluginsLoader({
    activityId: pluginsActivity,
    app: expressApp,
    configModule,
    container,
    rootDirectory: directory,
  })
  const pAct = logger.success(pluginsActivity, 'Plugins intialized') || {}
  track('PLUGINS_INIT_COMPLETED', { duration: pAct.duration })

  // subscribers loader

  // apis loaders
  const apiActivity = logger.activity(`Initializing API${EOL}`)
  track('API_INIT_STARTED')
  await apiLoader({ container, app: expressApp })
  const apiAct = logger.success(apiActivity, 'API initialized') || {}
  track('API_INIT_COMPLETED', { duration: apiAct.duration })

  // swagger loaders
  await swaggerLoader(expressApp)

  // default loaders

  // not found handlers
  expressApp.use('*', notFoundHandler)

  return { app: expressApp, container }
}

export default appLoader
