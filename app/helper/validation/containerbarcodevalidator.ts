import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { IValidator } from './ivalidator';
import { ValidationIssue, IssuePriority } from './validationissue';
import { ContainersService } from '../../services/containers.service';

export class ContainerBarcodeValidator implements IValidator {
    private subject: Subject<Array<ValidationIssue>>;
    public concern:string;

    constructor(private containersService:ContainersService) {

    }

    validate(data):Observable<Array<ValidationIssue>> {

        this.subject = new Subject<Array<ValidationIssue>>();

        this.containersService.getContainerByBarcode(data).subscribe(
            result => {

                if(result == null)
                {
                    var issue:ValidationIssue = new ValidationIssue("Container not found.", this.concern, IssuePriority.Warning);
                    this.subject.next([issue]);
                }
                else
                    this.subject.next([]);

                this.subject.complete();
            },
            error => {
                this.subject.error(error);
                this.subject.complete();
            }
        );

        return this.subject.asObservable();
    }
}
