import { IsIn, IsNotEmpty } from 'class-validator';

export class CreateMenuItemDTO {
  public static readonly ALLOWED_SCOPES = ['navigation', 'sub_navigation'];

  @IsNotEmpty({ message: "Menu item's label is required!" })
  readonly label: string;

  link: string;

  readonly icon: string;

  readonly is_private: boolean;

  @IsNotEmpty({ message: "Menu item's scope is required!" })
  @IsIn(CreateMenuItemDTO.ALLOWED_SCOPES, {
    message: 'Can accept only valid scopes (please choose from list)!',
  })
  readonly scope: string;
}

export class UpdateMenuItemDTO {
  readonly label: string;

  readonly link: string;

  readonly icon: string;

  @IsIn(CreateMenuItemDTO.ALLOWED_SCOPES, {
    message: 'Can accept only valid scopes (please choose from list)!',
  })
  readonly scope: string;
}

export class RemoveMenuItemDTO {
  readonly label: string;

  readonly link: string;

  readonly icon: string;

  readonly is_private: boolean;

  readonly scope: string;
}
