import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { environment } from "../environment";
import 'rxjs/Rx';   // Load all features
import { BaseAction } from '../models/actions/baseAction';
import {BaseService} from './base.service';

@Injectable()
export class CqrsService extends BaseService {

    constructor(public http: Http) {
        super(http);}

    public execute(actionName: string, data:any):Observable<any> {
        let body = { "Action": actionName, "model": data};

        return this.command(body);
    }

    public executeQuery(actionName: string, data: any): Observable<any> {
        let body = { "Action": actionName, "model": data };
        return this.query(body);
    }


     private onError(error: any) {
         var message = JSON.parse(error._body);
         console.error(message);
         return Observable.throw(message);
    }
}
