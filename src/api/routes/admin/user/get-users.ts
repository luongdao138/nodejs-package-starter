import { Request, Response } from 'express'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(10),
  age: z.number().min(10),
})

export default async function (req: Request, res: Response) {
  const validated = userSchema.parse({
    name: 'dao van luong',
    age: 21,
  })
  res.json([validated])
}
