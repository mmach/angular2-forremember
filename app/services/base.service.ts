import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { environment } from "../environment";
import 'rxjs/Rx';   // Load all features
import { Broadcaster } from '../helper/broadcast';

import { ValidatorService } from "./validator.service";

@Injectable()
export class BaseService {
    //public header: Headers;
    //public headerAuth: Headers;
    public apiUrl = environment.apiUrl;

    public broadcaster: Broadcaster;

    public get validatorService() {
        return <ValidatorService>(<any>window).CurrentValidatorService;
    }
    public set validatorService(value: ValidatorService) {
        (<any>window).CurrentValidatorService = value;
    }

    constructor(public http: Http
    //, public _cookieService: CookieService
    ) {
        this.broadcaster = (<any>window).GlobalBroadcaster;
    }

    command(action: any): Observable<any> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': this.getAuthToken()
        });

        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(action);
        return this.http.post(this.apiUrl + "/Command", body, options)
            .map((r) => {
                return r.json();
            })
            .catch(this.handleError);
    }

    query(action: any): Observable<any> {

        let headers = new Headers({
            //'Content-Type': 'application/json',
             'Authorization': this.getAuthToken()
        });

        let options = new RequestOptions({ headers: headers });
        let model = encodeURIComponent(JSON.stringify(action));

        return this.http.get(`${this.apiUrl}/Query?model=${model}`, options)
            .map((r) => {
                return r.json();
            })
            .catch(this.handleError);
    }

    isAuthenticated(): boolean {
        return (localStorage.getItem("token") != null);
    }

    getAuthToken() {
        return "Bearer " + localStorage.getItem("token");
    }

    public handleError(error: any) {

        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = JSON.parse(error._body);

        var userInterfaceMessage = ''
     
        if (errMsg.modelState.message ) {
            userInterfaceMessage = errMsg.modelState.message[0];
        }
        if (errMsg.modelState.authorization) {
            localStorage.removeItem("token");

        }
        var validatorService = (<any>window).CurrentValidatorService;

        //console.log(errMsg);
        //console.log(validatorService);

        if (validatorService) {
            if (errMsg.modelState) {
                for (var property in errMsg.modelState) {
                    if (errMsg.modelState.hasOwnProperty(property)) {
                        var validationModel = validatorService.getValidationModel(property);
                        if (!validationModel && property.startsWith("model.")) {
                            validationModel = validatorService.getValidationModel(property.substring(6));
                        }
                        if (validationModel) {
                            var validationResultText = null;
                            if (errMsg.modelState[property] && errMsg.modelState[property][0]) {
                                validationResultText = errMsg.modelState[property][0];
                            }
                            validationModel.setValid(false, validationResultText);
                        }
                    }
                }
            }
        }
        if (userInterfaceMessage) {
            (<any>window).GlobalBroadcaster.broadcast('errorMsg', userInterfaceMessage);
        }
        return Observable.throw(errMsg);
    }

    public errorMsgBroadcast(errorMsg: string) {
        this.broadcaster.broadcast('errorMsg', errorMsg);
    }
    public infoMsgBroadcast(infoMsg: string) {
        this.broadcaster.broadcast('infoMsg', infoMsg);
    }
    public succMsgBroadcast(successMsg: string) {
        this.broadcaster.broadcast('successMsg', successMsg);
    }

}
