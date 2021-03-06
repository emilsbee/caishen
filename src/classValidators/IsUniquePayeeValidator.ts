// External imports
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
import { getRepository } from 'typeorm';

// Internal imports
import { Payee } from '../entity/payee/payee';
  
/**
 * Validator constraint class for checking whether a given payee's name is unique.
 */
@ValidatorConstraint({ async: true })
export class IsPayeeAlreadyExistConstraint implements ValidatorConstraintInterface {

    validate(payeeName: any, args: ValidationArguments) {
        return getRepository(Payee).findOne({name: payeeName}).then(payee => {
        if (payee) return false;
        return true;
        }).catch(e => false);
    }

}

/**
 * Validator decorator for checking whether a payee's name is unique.
 * @param validationOptions 
 */
export function IsPayeeAlreadyExist(validationOptions?: ValidationOptions) {

    return function (object: Object, propertyName: string) {
        registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: IsPayeeAlreadyExistConstraint,
        });
};

}