import { BeforeInsert, Column, Entity, Index, OneToMany } from 'typeorm'

import { BaseEntity } from '../common/models/base-entity'
import generateEntityId from '../utils/generate-entity-id'
import { Post } from './post'

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  username: string

  @Index('user_email_idx', { unique: true })
  @Column({ type: 'varchar', nullable: false })
  email: string

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'usr')
  }
}
