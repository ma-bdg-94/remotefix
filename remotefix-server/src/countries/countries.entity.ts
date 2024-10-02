import {  Addresses } from 'src/addresses/addresses.entity';
import { Registries } from 'src/registries/registries.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Countries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 8 })
  flag: string;

  @Column('varchar', { length: 3 })
  isoCode: string;

  @Column('varchar', { length: 5 })
  phoneCode: string;

  @OneToOne(() => Registries, (registry) => registry.country)
  registry: Registries;

  @OneToMany(() =>  Addresses, ( Addresses) =>  Addresses.country)
  addresses:  Addresses[];

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
