import { Router } from 'express'

const userRoute = Router()

export default async function (baseRoute: Router) {
  userRoute.get('/', (req, res) => {
    res.json({ msg: 'Tada! Welcome to users route!' })
  })

  baseRoute.use('/users', userRoute)

  return baseRoute
}
