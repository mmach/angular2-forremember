import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ValidationIssue, IssuePriority } from './validationissue';
import { ValidationConcern } from './validationconcern';
import { IValidator } from './ivalidator';

export class ValidationGroup {

	public verbose: boolean;
	private validationConcerns:Array<ValidationConcern>;
	private formsBinding;
	public messages;
	public disabilities;

	constructor(validationConcerns, formsBinding, messages = {}, disabilities = {}) {

		this.verbose = false;
		this.validationConcerns = validationConcerns;
		this.formsBinding = formsBinding;
		this.messages = messages;
		this.disabilities = disabilities;

		var hasFieldsMissing = this.validationConcerns.some(
			validationConcern =>
				!this.formsBinding.hasOwnProperty(validationConcern.name) ||
				!this.messages.hasOwnProperty(validationConcern.name) ||
				!this.disabilities.hasOwnProperty(validationConcern.name)
		);

		if(hasFieldsMissing)
			this.print("hasFieldsMissing");
	}

	public validate(concernName: string):Observable<any> {
		return this.validateMany([concernName]);
	}

	public validateAll():Observable<any> {
		var concerns = this.validationConcerns.map(concern => concern.name);
		return this.validateMany(concerns);
	}

	public validateMany(concerns:Array<string>):Observable<any> {

		var subject = new Subject<boolean>();

		if(concerns.length == 0)
		{
			subject.next(true);
			subject.complete();
			return subject.asObservable();
		}

		var validators = this.flatten(
			this.validationConcerns
				.filter(concern => concerns.indexOf(concern.name) != -1)
				.map(concern => concern.validators)
		);

		if(validators.length == 0) {
			subject.next(true);
			subject.complete();
			return subject.asObservable();
		}

		concerns.forEach( concern => {
			this.disabilities[concern] = true;	/* disable input */
		});

		Observable.forkJoin(validators.map(v => v.validate(this.formsBinding[v.concern], this.formsBinding)))
			.subscribe(
				result => {
					var all = this.flatten(result);	/*all issues from all validators*/
					concerns.forEach( concern => {
						this.disabilities[concern] = false;	/* enable input */
						var issues = all.filter(issue => issue.concern == concern);	/* issues for particular concern*/
						//display message which have highest priority:
						issues.sort((issue1, issue2) => issue2.priority - issue1.priority);
						this.messages[concern] = issues.length > 0 ? issues[0].message : null;
					});

					var isValid = (all.length == 0);
					subject.next(isValid);
					subject.complete();
				},
				error => {
					concerns.forEach( concern => {
						this.messages[concern] = "Error occured.";
						this.disabilities[concern] = false;	/* enable input */
					});

					this.print(error);	
					subject.next(true);
					subject.complete();
				}
			);
		return subject.asObservable();
	}

	private concernExists(name: string):boolean {
		return this.validationConcerns.some( vc => vc.name == name);
	}

	private flatten(a) {
		return a.reduce((x, y) => {
			return Array.prototype.concat(x, y);
		});
	}

	private hasDuplicates(a): boolean
	{
		return (a.sort().filter((element, index, array) => (index != 0 && array[index] == array[index - 1]))
				.length() > 0);
	}

	private print(message: any) {
		if(this.verbose)
		{
			console.log("ValidationGroup:");
			console.log(message);
		}
	}
}
