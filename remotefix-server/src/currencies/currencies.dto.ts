export class AddCurrencyDTO {
  readonly name: string;
  readonly isoCode: string;
  readonly symbol?: string;
}

export class UpdateCurrencyDTO {
  readonly name: string;
  readonly isoCode: string;
  readonly symbol?: string;
}
