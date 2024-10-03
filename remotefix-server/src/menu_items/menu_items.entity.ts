import { IsBoolean, IsIn, IsNotEmpty, Matches } from 'class-validator';
import { BaseEntity } from 'src/base/base.entity';
import {
  Entity,
  Column,
} from 'typeorm';

@Entity('menu_items')
export class MenuItem extends BaseEntity {

  private static readonly LINK_REGEX = /^(?:(?:https?|ftp):\/\/|#|\/)(?:[\w_-]+(?:\/[\w_-]+)*)?(?:\?[\w_-]+=\w+(&[\w_-]+=\w+)*)?$/;

  private static readonly ALLOWED_SCOPES = [
    "navigation",
    "sub_navigation"
  ]

  @Column('int4')
  position: number;

  @Column('varchar', { length: 255 })
  @IsNotEmpty({ message: "Menu item's label is required!" })
  label: string;

  @Column('varchar', { length: 255, default: '#' })
  @IsNotEmpty({ message: "Menu item's associated link is required!" })
  @Matches(MenuItem.LINK_REGEX, { message: "Associated menu item's link seems not valid!" })
  link: string;

  @Column('boolean', { default: false })
  @IsBoolean({ message: "Can accept only logic (boolean) values for menu item's privacy!" })
  is_private: boolean;

  @Column('varchar', { length: 255, nullable: true })
  icon: string;

  @Column('varchar', { length: 80 })
  @IsNotEmpty({ message: "Menu item's scope is required!" })
  @IsIn(MenuItem.ALLOWED_SCOPES, { message: "Can accept only valid scopes (please choose from list)!" })
  scope: string;

  @Column('int', { array: true, nullable: true, default: [] })
  sub_items: number[];
}
