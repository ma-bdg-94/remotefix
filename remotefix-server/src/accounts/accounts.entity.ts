import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { BaseEntity } from 'src/base/base.entity';
import { ArraySize } from 'src/config/validators/custom.validator';
import { Currency } from 'src/currencies/currencies.entity';
import { Entity, Column, ManyToOne, JoinColumn, Check } from 'typeorm';

@Entity('accounts')
export class Account extends BaseEntity {
  @Column('varchar', { length: 255 })
  @IsNotEmpty({ message: "Account's label is required!" })
  label: string;

  @Column('numeric', { precision: 5, scale: 2 })
  @IsNotEmpty({ message: "Account's monthly fee is required!" })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Monthly fee seems not a valid number!' },
  )
  @Min(0, { message: "Account's monthly fee can never be negative!" })
  monthly_fee: number;

  @ManyToOne(() => Currency, (currency) => currency.accounts)
  @IsNotEmpty({
    message: "Account's related currency is required! Please select from list.",
  })
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @Column('int')
  @IsNotEmpty({
    message: "Account's required number of allowed companies is missing!",
  })
  @IsInt({
    message:
      "Companies's number seems not a valid integer (Cannot accept numbers with points)!",
  })
  @Min(1, { message: 'An account must include at least one company.' })
  nb_companies: number;

  @Column('int', { array: true })
  @IsNotEmpty({
    message:
      "Account's required maximum and minimum numbers of allowed work orders per company are missing!",
  })
  @ArraySize(2, {
    message:
      'The list of numbers of work orders per company includes only two numbers refering to the maximum and minimum values!',
  })
  @IsInt({
    each: true,
    message:
      'Numbers of allowed work orders per company seem not valid integers (Cannot accept numbers with points)!',
  })
  @Min(1, {
    each: true,
    message:
      'Cannot accept a number less than 1 for allowed work orders per company!',
  })
  nb_work_orders: number[];

  @Column('int', { array: true })
  @IsNotEmpty({
    message:
      "Account's required maximum and minimum numbers of allowed employees per company are missing!",
  })
  @ArraySize(2, {
    message:
      'The list of numbers of employees per company includes only two numbers refering to the maximum and minimum values!',
  })
  @IsInt({
    each: true,
    message:
      'Numbers of allowed employees seem not valid integers (Cannot accept numbers with points)!',
  })
  @Min(1, {
    each: true,
    message:
      'Cannot accept a number less than 1 for allowed employees per company!',
  })
  nb_employees: number[];
}
