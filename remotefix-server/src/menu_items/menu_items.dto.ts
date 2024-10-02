export class CreateMenuItemDTO {
  readonly label: string;
  readonly link: string;
  readonly icon: string;
  readonly is_private: boolean;
  readonly scope: string;
}

export class UpdateFieldDTO {
  field: string;
  value: any;
}

export class UpdateMenuItemDTO {
  readonly label: string;
  readonly link: string;
  readonly icon: string;
  readonly scope: string;
}
