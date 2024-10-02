import {  Accounts } from 'src/accounts/accounts.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Currencies {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 8 })
  symbol: string;

  @Column('varchar', { length: 3 })
  isoCode: string;

  @OneToMany(() =>  Accounts, ( Accounts) =>  Accounts.currency)
  accounts:  Accounts[];

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

  @Column('timestamp')
  archived_at: Date;
}
