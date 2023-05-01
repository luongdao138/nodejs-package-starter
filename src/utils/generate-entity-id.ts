import { ulid } from 'ulid'

/**
 * Generate a composed id based on the input parameters and return either the is if it exists or the generated one.
 * @param idProperty
 * @param prefix
 */
export default function generateEntityId(idProperty: string, prefix?: string): string {
  if (idProperty) {
    return idProperty
  }

  const id = ulid()

  if (!prefix?.trim().length) {
    return id
  }

  prefix = prefix ? `${prefix}_` : ''
  return `${prefix}${id}`
}
