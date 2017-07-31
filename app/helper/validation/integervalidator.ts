import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { IValidator } from './ivalidator';
import { ValidationIssue, IssuePriority } from './validationissue';

export class IntegerValidator implements IValidator {
	public concern:string;

	constructor() {
		
	}

	validate(data):Observable<Array<ValidationIssue>> {
		return Observable.from([this.execute(data)]);
	}

	private execute(data):Array<ValidationIssue> {

		var issues = new Array<ValidationIssue>();

		if(parseInt(data).toString() != data.toString())
			var issue:ValidationIssue = new ValidationIssue("Only integer numbers are allowed", this.concern, IssuePriority.Warning);

		return issues;
	}
}
