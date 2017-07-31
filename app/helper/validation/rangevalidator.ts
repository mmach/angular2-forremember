import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { IValidator } from './ivalidator';
import { ValidationIssue, IssuePriority } from './validationissue';

export class RangeValidator implements IValidator {
	private subject: Subject<Array<ValidationIssue>>;
	public concern:string;

	private lowerLimit;
	private upperLimit;
	private includingLowerLimit: boolean;
	private includingUpperLimit: boolean;

	constructor(lowerLimit, upperLimit, includingLowerLimit = false, includingUpperLimit = false) {
		this.lowerLimit = lowerLimit;
		this.upperLimit = upperLimit;
		this.includingLowerLimit = includingLowerLimit;	/*range includes lower limit*/
		this.includingUpperLimit = includingUpperLimit;
	}

	validate(data):Observable<Array<ValidationIssue>> {

		this.subject = new Subject<Array<ValidationIssue>>();

		if(isNaN(parseInt(data))) {
			var issue:ValidationIssue = new ValidationIssue("Please enter number in correct format", this.concern, IssuePriority.Warning);
			this.subject.next([issue]);
		}
		else {
			//parse?
			var rangeInvalid: boolean =
				(this.includingLowerLimit && (data < this.lowerLimit)) ||
				(!this.includingLowerLimit && (data <= this.lowerLimit)) ||
				(this.includingUpperLimit && (data < this.upperLimit)) ||
				(!this.includingUpperLimit && (data <= this.upperLimit));

			if(rangeInvalid) {
				var message = "Please specify number between " + this.lowerLimit.toString() + " and " + this.upperLimit.toString();
				var issue:ValidationIssue = new ValidationIssue(message, this.concern, IssuePriority.Warning);
				this.subject.next([issue]);
			}
			else
				this.subject.next([]);
		}

		this.subject.complete();
		return this.subject.asObservable();
	}
}
