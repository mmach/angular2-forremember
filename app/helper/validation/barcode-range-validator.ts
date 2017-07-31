import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { IValidator } from './ivalidator';
import { ValidationIssue, IssuePriority } from './validationissue';
import { ContainersService } from '../../services/containers.service';

@Injectable()
export class BarCodeRangeValidator implements IValidator {
    public concern:string;

    constructor(private containersService:ContainersService) {

    }

    validate(data, allData): Observable<Array<ValidationIssue>> {

        let subject = new Subject<Array<ValidationIssue>>();

        if(!allData.containerType || !allData.startBarcode || !allData.endBarcode || !data)
            return Observable.from( [new Array<ValidationIssue>()]);

        // this.containersService.verificateBarCodeRange(allData).subscribe(
        //     result => {

        //         let arr = [];

        //         if(result.errorCode)
        //             arr.push(new ValidationIssue(result.ErrorDescription, this.concern, IssuePriority.Warning));

        //         subject.next(arr);
        //         subject.complete();
        //     },
        //     error => {
        //         subject.error(error);
        //         subject.complete();
        //     }
        // );

        return subject.asObservable();
    }
}
