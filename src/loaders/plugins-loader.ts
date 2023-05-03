import { asFunction, asValue, Lifetime } from 'awilix'
import { Express } from 'express'
import { glob } from 'glob'
import _ from 'lodash'
import { EntitySchema, Repository } from 'typeorm'

import { BASE_ENDPOINT } from '../constants/api'
import { ClassConstructor, ConfigModule, Logger } from '../types'
import { AppContainer } from '../utils'
import formatRegistrationName from '../utils/format-registration-name'
import { loadModule } from '../utils/module'

type ModelOptions = {
  container: AppContainer
  rootDirectory: string
  configModule: ConfigModule
}

type LoadedModule = ClassConstructor<unknown> | EntitySchema

interface PluginDetails {
  resolve: string
  name: string
  id: string
  options: Record<string, unknown>
  version: string
}

// TODO: Create unique id for each plugin
function createPluginId(name: string): string {
  return name
}

function createFileContentHash(path, files): string {
  return path + files
}

/**
 * Finds the correct path for the plugin. If it is a local plugin, it will be found in the plugins folder. Otherwise
 * we will look for the plugin in the installed npm packages
 * Not implemented for not (it will be implemented when we actually have some plugins to be installed)
 * @param pluginName the name of plugn to find. Should match the name of the folder where the plugin is located
 * @returns {object} the plugin details
 */
function resolvePlugin(pluginName: string): PluginDetails {
  return {
    name: pluginName,
    id: createPluginId(pluginName),
    version: '1.0.0',
    options: {},
    resolve: pluginName,
  }
}

async function runSetupFunctions(pluginDetail: PluginDetails): Promise<void> {
  const files = glob.sync(`${pluginDetail.resolve}/setup/*.js`, {})
  await Promise.all(
    files.map(async (file) => {
      const loaded = (await loadModule<any>(file)).default

      try {
        await loaded()
      } catch (error) {
        throw new Error(`a setup function from ${pluginDetail.name} failed. ${error}`)
      }
    }),
  )
}

async function runPluginLoaders(pluginDetail: PluginDetails, container: AppContainer, app: Express) {
  const files = glob.sync(`${pluginDetail.resolve}/loaders/[!__]*.js`)

  await Promise.all(
    files.map(async (file) => {
      const loaded = (await loadModule<any>(file)).default

      if (!_.isFunction(loaded)) return

      try {
        await loaded(container, app, pluginDetail.options)
      } catch (error) {
        const logger = container.resolve<Logger>('logger')
        logger.warn(`a loader function from ${pluginDetail.name} failed: ${error.message}`)
        return Promise.resolve()
      }
    }),
  )
}

// only resolved project plugin for now
function getResolvedPlugins(rootDirectory: string, configModule: ConfigModule): PluginDetails[] {
  const { plugins = [] } = configModule
  const resolved: PluginDetails[] = plugins.map((plugin) => {
    if (_.isString(plugin)) {
      return resolvePlugin(plugin)
    }

    const details = resolvePlugin(plugin.resolve)
    details.options = plugin.options

    return details
  })

  resolved.push({
    name: 'project-plugin',
    id: createPluginId('project-plugin'),
    options: {},
    version: createFileContentHash(process.cwd(), '**'),
    resolve: `${rootDirectory}/dist`,
  })

  return resolved
}

export async function registerPluginModels({ container, rootDirectory, configModule }: ModelOptions) {
  const resolved = getResolvedPlugins(rootDirectory, configModule)

  await Promise.all(
    resolved.map(async (pluginDetail) => {
      await registerModels(pluginDetail, container)
    }),
  )
}

/**
 * Register a plugin's repositories at the right location in awilix container
 * repositories are registered directly in the container
 * @param {object} pluginDetail - the plugin details including plugin options
 * @param {object} container  - the container where the repositories will be registered
 */
export async function registerRepositories(pluginDetail: PluginDetails, container: AppContainer) {
  const files = glob.sync(`${pluginDetail.resolve}/repositories/*.js`, {
    ignore: {
      ignored: (p) => p.name.endsWith('index.js'),
    },
  })

  await Promise.all(
    files.map(async (file) => {
      const loaded = (await loadModule<any>(file)).default

      if (!loaded || !(loaded instanceof Repository)) return

      const name = formatRegistrationName(file)

      container.register({
        [name]: asValue(loaded),
      })
    }),
  )
}

/**
 * Registers a service at the right location in our container. If the service is
 * a BaseService instance it will be available directly from the container.
 * container. Names are camelCase formatted and namespaced by the folder i.e:
 * services/example-payments -> examplePaymentsService
 * @param {object} pluginDetails - the plugin details including plugin options,
 *    version, id, resolved path, etc. See resolvePlugin
 * @param {object} container - the container where the services will be
 * @param {object} configModule - the configModule loaded from config file
 * @return {void}
 */
export async function registerServices(
  pluginDetail: PluginDetails,
  container: AppContainer,
  configModule: ConfigModule,
) {
  const files = glob.sync(`${pluginDetail.resolve}/services/*.js`, {
    ignore: {
      ignored: (p) => p.name.endsWith('index.js'),
    },
  })

  await Promise.all(
    files.map(async (file) => {
      const loaded = (await loadModule<any>(file)).default

      if (!loaded) return

      const name = formatRegistrationName(file)

      container.register({
        [name]: asFunction((cradle) => new loaded(cradle, configModule, pluginDetail.options), {
          lifetime: loaded.LIFE_TIME || Lifetime.SCOPED,
        }),
      })
    }),
  )
}

export async function registerApis(
  pluginDetail: PluginDetails,
  app: Express,
  rootDirectory: string,
  container: AppContainer,
  activityId: string,
  configModule: ConfigModule,
) {
  const logger = container.resolve<Logger>('logger')

  logger.progress(activityId, `Registering custom endpoints for ${pluginDetail.name}`)

  try {
    const initCustomRoutes = (await loadModule<any>(`${pluginDetail.resolve}/api`)).default

    if (!initCustomRoutes || !_.isFunction(initCustomRoutes)) return app

    app.use(BASE_ENDPOINT, initCustomRoutes(rootDirectory, configModule, pluginDetail.options || {}))

    return app
  } catch (error) {
    if (error.message !== `Cannot find module '${pluginDetail.resolve}/api'`) {
      logger.progress(activityId, `No customer endpoints registered for ${pluginDetail.name}`)
    }
    return app
  }
}

export async function registerModels(pluginDetail: PluginDetails, container: AppContainer) {
  const files = glob.sync(`${pluginDetail.resolve}/models/*.js`, {})

  await Promise.all(
    files.map(async (file) => {
      const loaded = await loadModule<LoadedModule>(file)

      Object.entries(loaded).forEach(([, val]: [string, LoadedModule]) => {
        if (typeof val === 'function' || val instanceof EntitySchema) {
          const name = formatRegistrationName(file)

          container.register({
            [name]: asValue(val),
          })

          container.registerAdd('db_entities', asValue(val))
        }
      })
    }),
  )
}

type Options = {
  rootDirectory: string
  container: AppContainer
  configModule: ConfigModule
  app: Express
  activityId: string
}

export default async function ({ configModule, rootDirectory, app, container, activityId }: Options) {
  // get all resolved plugins
  const resolvedPlugins = getResolvedPlugins(rootDirectory, configModule)

  // run all setup functions of each plugin
  await Promise.all(resolvedPlugins.map(async (pluginDetails) => await runSetupFunctions(pluginDetails)))

  // register all plugins's repositories, services, api, ...
  await Promise.all(
    resolvedPlugins.map(async (pluginDetail) => {
      await registerRepositories(pluginDetail, container)
      await registerServices(pluginDetail, container, configModule)
      await registerApis(pluginDetail, app, rootDirectory, container, activityId, configModule)
    }),
  )

  // run all plugin's loaders
  await Promise.all(resolvedPlugins.map(async (pluginDetail) => runPluginLoaders(pluginDetail, container, app)))
}
