import { LoaderConfig, LoaderResult } from '../types/globals'
import expressLoader from './express-loader'

const appLoader = async ({ expressApp }: LoaderConfig): Promise<LoaderResult> => {
  // load basic epxress app config
  expressLoader({ app: expressApp })

  return { app: expressApp }
}

export default appLoader
