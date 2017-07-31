import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { IValidator } from './ivalidator';
import { ValidationIssue, IssuePriority } from './validationissue';
import { ContainersService } from '../../services/containers.service';

@Injectable()
export class RequiredValidator implements IValidator {
	private subject: Subject<Array<ValidationIssue>>;
	public concern:string;

	constructor() {
		
	}

	validate(data, allData):Observable<Array<ValidationIssue>> {
		return Observable.from([this.execute(data)]);
	}

	private execute(data):Array<ValidationIssue> {

		var issues = new Array<ValidationIssue>();

		if(data == undefined || data == null || data.toString().trim() == "") {
			var issue:ValidationIssue = new ValidationIssue("Please fill out the form.", this.concern, IssuePriority.Warning);
			issues.push(issue);
		}

		return issues;
	}
}
