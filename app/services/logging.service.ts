import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { BaseAction } from '../models/actions/baseAction';
import { environment } from "../environment";
import { BaseService } from "../services/base.service";
import { GetLogListAction } from "../models/actions/GetLogListAction";

@Injectable()
export class LogginService extends BaseService {
    constructor(public http: Http) {
        super(http);
    }

    getLogList(path: string): Observable<Array<string>> {
        return this.query(new GetLogListAction(path));
    }

}