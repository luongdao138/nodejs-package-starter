import dotenv from 'dotenv-safe'
import express from 'express'

import appLoader from './loaders'

export * from './common'
export * from './models'
export * from './types'
export * from './utils'

const testLoader = async () => {
  dotenv.config()
  const app = express()

  process.env.TEST_LOADER &&
    (await appLoader({
      directory: process.cwd(),
      expressApp: app,
    }))
}

testLoader()

export default appLoader
