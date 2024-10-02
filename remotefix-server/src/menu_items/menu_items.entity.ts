import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MenuItems {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int4')
  position: number;

  @Column('varchar', { length: 255 })
  label: string;

  @Column('varchar', { length: 255 })
  link: string;

  @Column('bool', { default: false })
  is_private: boolean;

  @Column('varchar', { length: 255, nullable: true })
  icon: string;

  @Column('varchar', { nullable: true, default: null })
  scope: string;

  @Column('int', { array: true, nullable: true })
  subItems: number[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('bool', { default: false })
  deleted: boolean;

  @DeleteDateColumn()
  deleted_at: Date;

  @Column('bool', { default: false })
  archived: boolean;

  @Column('timestamp', { default: new Date() })
  archived_at: Date;
}
