export class UpdateFieldDTO<T> {
  field: keyof T;
  value: any;
}