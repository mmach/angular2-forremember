import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, ReplaySubject }     from 'rxjs';
import { BaseService } from "../services/base.service";
import { GetUserRolesAction } from '../models/actions/getUserRolesAction';

@Injectable()
export class UserRolesService extends BaseService {
    private cache:ReplaySubject<string[]>;
    constructor(public http: Http) {
        super(http);
        this.cache =  new ReplaySubject<string[]>(1);
    }

    public getRoles(reload: boolean):Observable<string[]>{
        if (!this.cache.observers.length || reload){
            this.query(new GetUserRolesAction())
                .subscribe(
                    r=>this.cache.next(r),
                    e=>this.cache.error(e)
            );
        }
        return this.cache;
    }

    public HasRole(roleName: string):boolean{
        return true;
    }
}