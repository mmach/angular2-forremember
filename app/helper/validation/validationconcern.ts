import { IValidator } from './ivalidator';

export class ValidationConcern {

	public name: string;
	public validators: Array<IValidator>;

	constructor(name: string, validators:Array<IValidator>) {
		this.name = name;
		this.validators = validators.map(validator => {
			validator.concern = name;
			return validator;
		});
	}
}
