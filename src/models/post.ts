import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { BaseEntity } from '../common/models/base-entity'
import generateEntityId from '../utils/generate-entity-id'
import { User } from './user'

@Entity()
export class Post extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  title: string | null

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'varchar', nullable: false })
  user_id: string

  @ManyToOne(() => User)
  @JoinColumn({ referencedColumnName: 'id', name: 'user_id' })
  user: User

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'post')
  }
}
