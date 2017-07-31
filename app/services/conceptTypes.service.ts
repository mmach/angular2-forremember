import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { IConceptType } from "../models/conceptType";
import { GetConceptTypesAction } from "../models/actions/GetConceptTypesAction";
import { BaseService } from "./base.service";
import { environment } from "../environment";

@Injectable()
export class ConceptTypesService extends BaseService {

    constructor(public http: Http) {
        super(http);
    }

    getConceptTypes(): Observable<IConceptType[]> {
        return this.query(new GetConceptTypesAction());
    }
}
