import { IsIn, IsNotEmpty, Length } from 'class-validator';
import { Account } from 'src/accounts/accounts.entity';
import { BaseEntity } from 'src/base/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { CurrencyTemplate, currencies } from './currencies.utils';

@Entity('currencies')
export class Currency extends BaseEntity {
  private static readonly AVAILABLE_CURRENCIES = {
    names: currencies.map((currency: CurrencyTemplate) => currency.name),
    isoCodes: currencies.map((currency: CurrencyTemplate) => currency.isoCode),
    symbols: [
      ...new Set(
        currencies?.flatMap((currency: CurrencyTemplate) => [
          currency.symbol,
          currency.symbolNative,
        ]),
      ),
    ],
  };

  @Column('varchar', { length: 255 })
  @IsNotEmpty({ message: "Currency's (english) name is required!" })
  @IsIn(Currency.AVAILABLE_CURRENCIES.names, {
    message: 'Can accept only valid english names (please choose from list)!',
  })
  name: string;

  @Column('varchar', { length: 8 })
  @IsNotEmpty({ message: "Currency's symbol is required!" })
  @IsIn(Currency.AVAILABLE_CURRENCIES.symbols, {
    message: 'Can accept only valid symbols (please choose from list)!',
  })
  symbol: string;

  @Column('varchar', { length: 3 })
  @IsNotEmpty({ message: "Currency's ISO-4217 code is required!" })
  @Length(3, 3, { message: "Currency's ISO-4217 code must contain three characters!" })
  @IsIn(Currency.AVAILABLE_CURRENCIES.isoCodes, {
    message: 'Can accept only valid ISO-4217 codes (please choose from list)!',
  })
  isoCode: string;

  @OneToMany(() => Account, (Account) => Account.currency)
  accounts: Account[];
}
