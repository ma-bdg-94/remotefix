import { Currencies } from 'src/currencies/currencies.entity';

export class AddAccountDTO {
  readonly label: string;
  readonly monthlyFee: number;
  readonly currency: Currencies;
  readonly nbCompanies: number;
  readonly nbWorkOrders: number[];
  readonly nbEmployees: number[];
}

export class UpdateFieldDTO {
  field: string;
  value: any;
}
