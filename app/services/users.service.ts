import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { environment } from "../environment";
import { UserNotAuthAction } from '../models/actions/UserNotAuthAction';
import { LoginAction } from '../models/actions/loginAction';
import { BaseService } from './base.service';
import { GetUserAction } from '../models/actions/getUserAction';
import { GetUsersAction } from '../models/actions/getUsersAction';
import { IUser } from '../models/user';

@Injectable()
export class UsersService extends BaseService  {
    
    constructor(public http: Http)  { 
        super(http);
    }

    public getUser(): Observable<any> {
        return this.query(new GetUserAction());
    }
     
    public getUsers(): Observable<IUser[]> {
        return this.query(new GetUsersAction());
    }

    Login(model: LoginAction, url: string): Observable<any> {

        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
             //     'Access-Control-Allow-Origin': '*'
        });
        var creds = "username=" + model.userName + "&password=" + model.password+"&grant_type=password";
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.apiUrl + url, creds, { headers })
            .map(r => r.json().access_token)
            .do(data => JSON.stringify(data));
    }
    isAdmin(){
        return true;
    }

    LogIn(token: string) {
        localStorage.setItem("token", token)
        this.broadcaster.broadcast('login', null);
    }

    LogOut() {
        localStorage.removeItem("token");
        this.broadcaster.broadcast('USER_LOGGED_OUT', null);
    }
}
