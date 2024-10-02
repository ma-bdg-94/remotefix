import { Countries } from 'src/countries/countries.entity';
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
export class  Addresses {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Countries, (country) => country.addresses)
  @JoinColumn({ name: 'country_id' })
  country: Countries;

  @Column('varchar', { length: 255 })
  state: string;

  @Column('varchar', { length: 255 })
  city: string;

  @Column('varchar', { length: 20 })
  postal_code: string;

  @Column('varchar', { length: 255 })
  street: string;

  @Column('point')
  coordinates: string;

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
