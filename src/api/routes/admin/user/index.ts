import { Router } from 'express'

import { wrapHandler } from '../../../../common/wrap-handler'

const userRoute = Router()

export default async function (baseRoute: Router) {
  userRoute.get('/', wrapHandler((await import('./get-users')).default))

  baseRoute.use('/users', userRoute)

  return baseRoute
}
