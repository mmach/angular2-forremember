import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';

import { IConcept } from '../models/concept';
import { environment } from "../environment";
import { BaseService } from "./base.service";
import { IConceptType } from "../models/concepttype";

import { ConceptPageWrapper, ConceptsPagedSearch } from "../models/container-page-wrapper";

import { UpdateConceptAction } from "../models/actions/UpdateConceptAction";
import { DeleteConceptAction } from "../models/actions/DeleteConceptAction";
import { GetConceptsAction } from "../models/actions/GetConceptsAction";
import { GetConceptAction } from "../models/actions/GetConceptAction";
import { RegisterConceptAction } from "../models/actions/RegisterConceptAction";
import { CreateConceptAction } from "../models/actions/CreateConceptAction";
import { InitializeElasticSearchConceptsAction } from "../models/actions/concepts/initializeElasticSearchConceptsAction";

@Injectable()
export class ConceptsService extends BaseService {

    private ENDPOINT = environment.apiUrl;

    constructor(public http: Http) {
        super(http);
    }

    getConceptsWithPages(pagedSearch: ConceptsPagedSearch): Observable<ConceptPageWrapper> {        
        return this.query(new GetConceptsAction(pagedSearch))
    }

    createConcept(concept: IConcept): Observable<any> {
        return this.command(new CreateConceptAction(concept));
    }

    updateConcept(concept:IConcept): Observable<any> {
        return this.command(new UpdateConceptAction(concept));
    }

    deleteConcept(conceptID: number, userID: number) {
        return this.command(new DeleteConceptAction(conceptID));
    }

    registerConcept(concept: IConcept): Observable<any> {
        return this.command(new RegisterConceptAction(concept));
    }

    getConceptByID(ID: number): Observable<IConcept> {
        return this.command(new GetConceptAction(ID));
    }
    initializeElasticSearchConcepts():Observable<any>{
        return this.command(new InitializeElasticSearchConceptsAction());
    }
}
