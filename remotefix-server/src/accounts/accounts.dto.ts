import { Currency } from 'src/currencies/currencies.entity';

export class AddAccountDTO {
  readonly label: string;
  readonly monthlyFee: number;
  readonly currency: Currency;
  readonly nbCompanies: number;
  readonly nbWorkOrders: number[];
  readonly nbEmployees: number[];
}

export class UpdateFieldDTO {
  field: string;
  value: any;
}
