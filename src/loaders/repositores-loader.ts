import path from 'node:path'

import { asValue } from 'awilix'
import { glob } from 'glob'

import { AppContainer, loadModule } from '../utils'
import formatRegistrationName from '../utils/format-registration-name'

type Options = {
  container: AppContainer
}

export default async function ({ container }: Options) {
  const corePath = '../repositories/*.js'
  const coreFull = path.join(__dirname, corePath)

  const core = glob.sync(coreFull, { cwd: __dirname })

  await Promise.all(
    core.map(async (modulePath) => {
      const loaded = (await loadModule<any>(modulePath)).default

      if (typeof loaded === 'object') {
        const registrationName = formatRegistrationName(modulePath)
        container.register({
          [registrationName]: asValue(loaded),
        })
      }
    }),
  )
}
