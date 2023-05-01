import { BeforeInsert, Column, Entity } from 'typeorm'

import { BaseEntity } from '../common/models/base-entity'
import generateEntityId from '../utils/generate-entity-id'

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar' })
  username: string | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'usr')
  }
}
