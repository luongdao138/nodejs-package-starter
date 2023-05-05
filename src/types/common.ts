import 'reflect-metadata'

import { FindManyOptions, FindOneOptions, FindOperator, FindOptionsSelect, FindOptionsWhere } from 'typeorm'
import { FindOptionsOrder } from 'typeorm/find-options/FindOptionsOrder'
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations'

import { BaseEntity } from '../common'

/**
 * Utility type used to remove some optional attributes (coming from K) from a type T
 */
export type WithRequiredProperty<T, K extends keyof T> = T & {
  // -? removes 'optional' from a property
  [Property in K]-?: T[Property]
}

export type PartialPick<T, K extends keyof T> = {
  [P in K]?: T[P]
}

export type Writable<T> = {
  -readonly [key in keyof T]: T[key] | FindOperator<T[key]> | FindOperator<T[key][]> | FindOperator<string[]>
}

export interface FindConfig<Entity> {
  select?: (keyof Entity)[]
  skip?: number
  take?: number
  relations?: string[]
  order?: { [K: string]: 'ASC' | 'DESC' }
}

export type ExtendedFindConfig<TEntity> = (
  | Omit<FindOneOptions<TEntity>, 'where' | 'relations' | 'select'>
  | Omit<FindManyOptions<TEntity>, 'where' | 'relations' | 'select'>
) & {
  select?: FindOptionsSelect<TEntity>
  relations?: FindOptionsRelations<TEntity>
  where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[]
  order?: FindOptionsOrder<TEntity>
  skip?: number
  take?: number
}

export type QuerySelector<TEntity> = Selector<TEntity> & { q?: string }
export type TreeQuerySelector<TEntity> = QuerySelector<TEntity> & {
  include_descendants_tree?: boolean
}

export type Selector<TEntity> = {
  [key in keyof TEntity]?:
    | TEntity[key]
    | TEntity[key][]
    // | DateComparisonOperator
    // | StringComparisonOperator
    // | NumericalComparisonOperator
    | FindOperator<TEntity[key][] | string | string[]>
}
export interface CustomFindOptions<TModel, InKeys extends keyof TModel> {
  select?: FindManyOptions<TModel>['select']
  where?: FindManyOptions<TModel>['where'] & {
    [P in InKeys]?: TModel[P][]
  }
  order?: { [K: string]: 'ASC' | 'DESC' }
  skip?: number
  take?: number
}

export type QueryConfig<TEntity extends BaseEntity> = {
  defaultFields?: (keyof TEntity | string)[]
  defaultRelations?: string[]
  allowedFields?: string[]
  allowedRelations?: string[]
  defaultLimit?: number
  isList?: boolean
}

export type RequestQueryFields = {
  expand?: string
  fields?: string
  offset?: number
  limit?: number
  order?: string
}

export type PaginatedResponse = { limit: number; offset: number; count: number }

export type DeleteResponse = {
  id: string
  object: string
  deleted: boolean
}

export class EmptyQueryParams {}
