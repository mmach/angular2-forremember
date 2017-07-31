import { Observable } from 'rxjs/Observable';
import { ValidationIssue, IssuePriority } from './validationissue';

export interface IValidator {
	concern: string;
	validate(data: any, allData: any):Observable<Array<ValidationIssue>>;
}
