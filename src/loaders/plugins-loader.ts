import { asValue } from 'awilix'
import { glob } from 'glob'
import { EntitySchema } from 'typeorm'

import { ClassConstructor, ConfigModule } from '../types'
import { AppContainer } from '../utils'
import formatRegistrationName from '../utils/format-registration-name'
import { loadModule } from '../utils/module'

type Options = {
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

// only resolved project plugin for now
function getResolvedPlugins(rootDirectory: string): PluginDetails[] {
  const resolved: PluginDetails[] = []

  resolved.push({
    name: 'project-plugin',
    id: createPluginId('project-plugin'),
    options: {},
    version: createFileContentHash(process.cwd(), '**'),
    resolve: `${rootDirectory}/dist`,
  })

  return resolved
}

export async function registerPluginModels({ container, rootDirectory }: Options) {
  const resolved = getResolvedPlugins(rootDirectory)

  await Promise.all(
    resolved.map(async (pluginDetail) => {
      await registerModels(pluginDetail, container)
    }),
  )
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
