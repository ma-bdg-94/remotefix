import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date

  @Column('boolean', { default: false })
  is_deleted: boolean

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date

  @Column('boolean', { default: false })
  is_archived: boolean

  @Column('timestamp', { default: new Date() })
  archived_at: Date
}