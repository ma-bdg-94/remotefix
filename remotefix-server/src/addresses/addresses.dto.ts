import { Countries } from 'src/countries/countries.entity';

export class AddAddressDTO {
  readonly state: string;
  readonly city: string;
  readonly street: string;
  readonly country: Countries;
  readonly postal_code: string;
  readonly coordinates: string;
}

export class UpdateAddressDTO {
  readonly state: string;
  readonly city: string;
  readonly street: string;
  readonly monthlyFee: number;
  readonly country: Countries;
  readonly postal_code: string;
  readonly coordinates: string;
}
