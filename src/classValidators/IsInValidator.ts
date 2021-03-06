import { 
  ValidatorConstraint, 
  ValidatorConstraintInterface, 
  ValidationArguments
} from 'class-validator';

/**
 * Custom validator constraint class that checks whether the given text is in the constraints array.
 */
@ValidatorConstraint({ name: "IsOneOf", async: false })
export class IsOneOf implements ValidatorConstraintInterface {

  validate(text: string, args: ValidationArguments) {
    return args.constraints.includes(text); // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    return `The value ${args.value} is not one of the allowed: ${args.constraints}.`;
  }

}
