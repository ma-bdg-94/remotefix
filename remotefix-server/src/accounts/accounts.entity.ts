import { Currencies } from 'src/currencies/currencies.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class  Accounts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  label: string;

  @Column('numeric', { precision: 5, scale: 2 })
  monthlyFee: number;

  @ManyToOne(() => Currencies, (currency) => currency.accounts)
  @JoinColumn({ name: 'currency_id' })
  currency: Currencies;

  @Column('int')
  nbCompanies: number;

  @Column('int', { array: true })
  nbWorkOrders: number[];

  @Column('int', { array: true })
  nbEmployees: number[];

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
