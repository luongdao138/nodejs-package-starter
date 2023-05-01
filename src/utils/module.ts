import { EntitySchema } from 'typeorm'

import { ClassConstructor } from '../types'

export type LoadedModule = ClassConstructor<unknown> | EntitySchema

export async function loadModule(path: string): Promise<LoadedModule> {
  return (await import(path)) as LoadedModule
}
