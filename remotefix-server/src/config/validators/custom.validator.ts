import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function ArraySize(size: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ArraySize',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [size],
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (Array.isArray(value)) {
            return value.length === args.constraints[0];
          }
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `The array must contain exactly ${args.constraints[0]} elements.`;
        },
      },
    });
  };
}
