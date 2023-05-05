import express from 'express'

import appLoader from './loaders'

export * from './api'
export * from './api/middlewares'
export * from './common'
export * from './models'
export * from './types'
export * from './utils'

const bootstrap = async () => {
  const app = express()

  await appLoader({
    directory: process.cwd(),
    expressApp: app,
  })
}

bootstrap()

export default appLoader
