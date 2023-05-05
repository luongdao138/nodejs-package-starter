import path from 'node:path'

import { Express } from 'express'
import swaggerUI from 'swagger-ui-express'

import logger from '../cli/reporter'
import { loadModule } from '../utils'

const isDev = process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development'

/**
 * Instantiate swagger ui express only in dev environment
 * @param app Express app instance
 */
export default async function (app: Express) {
  if (!isDev) return

  try {
    const frontSwaggerDocument = await loadModule<any>(path.resolve('src', 'swagger', 'front-spec.json'))
    app.use('/front/api-docs', swaggerUI.serve, swaggerUI.setup(frontSwaggerDocument))
  } catch (error) {
    logger.warn('Error when setup swagger ui express: ' + error)
  }
}
