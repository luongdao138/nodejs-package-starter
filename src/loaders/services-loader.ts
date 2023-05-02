import path from 'node:path'

import { asFunction } from 'awilix'
import { glob } from 'glob'

import { ConfigModule } from '../types'
import { AppContainer, loadModule } from '../utils'
import formatRegistrationName from '../utils/format-registration-name'

type Options = {
  configModule: ConfigModule
  container: AppContainer
}

export default async function ({ configModule, container }: Options) {
  const corePath = '../services/*.js'
  const coreFull = path.join(__dirname, corePath)

  const core = glob.sync(coreFull, {
    cwd: __dirname,
    ignore: {
      ignored(p) {
        return p.name.includes('index.js')
      },
    },
  })

  await Promise.all(
    core.map(async (modulePath) => {
      const loaded = (await loadModule<any>(modulePath))?.default

      if (!loaded) return

      const name = formatRegistrationName(modulePath)
      container.register({
        [name]: asFunction((cradle) => {
          return new loaded(cradle, configModule)
        }),
      })
    }),
  )
}
