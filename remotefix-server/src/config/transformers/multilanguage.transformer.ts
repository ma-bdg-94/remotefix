import { ValueTransformer } from 'typeorm';
import { Multilanguage } from '../types/types';

export class MultilanguageTransformer implements ValueTransformer {
  // From database -> to Entity
  from(value: any): Multilanguage {
    return value ? JSON.parse(value) : null;
  }

  // From Entity -> to database
  to(value: Multilanguage): any {
    return value ? JSON.stringify(value) : null;
  }
}
