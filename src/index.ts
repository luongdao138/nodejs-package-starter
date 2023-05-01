import express from 'express'

import appLoader from './loaders'

export * from './types'
export * from './utils'

const app = express()

appLoader({
  directory: process.cwd(),
  expressApp: app,
})

export default appLoader
