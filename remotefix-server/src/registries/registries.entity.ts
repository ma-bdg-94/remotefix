import { MultilanguageTransformer } from '../../src/config/transformers/multilanguage.transformer';
import { Multilanguage } from 'src/config/types/types';
import { Countries } from 'src/countries/countries.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Registries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { transformer: new MultilanguageTransformer() })
  label: Multilanguage;

  @Column('varchar', { length: 20 })
  registryNumber: Multilanguage;

  @OneToOne(() => Countries, (country) => country.registry)
  @JoinColumn({ name: 'country_id' })
  country: Countries;

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
