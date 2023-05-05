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

/**
 * @schema user
 * title: "User"
 * description: "Represents a User of system."
 * x-resourceId: user
 * type: object
 * required:
 *   - email
 *   - username
 * properties:
 *   id:
 *     type: string
 *     description: The user's ID
 *     example: usr_01G1G5V26F5TB3GPAPNJ8X1S3V
 *   email:
 *     description: "The email of the User"
 *     type: string
 *     format: email
 *   username:
 *     description: "The username of the User"
 *     type: string
 *     format: username
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 */
