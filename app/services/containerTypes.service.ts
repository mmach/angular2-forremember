import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';   // Load all features

import { IContainerType } from "../models/containerType";
import { environment } from "../environment";
import { BaseService } from "../services/base.service";

import { GetContainerTypesAction } from "../models/actions/GetContainerTypesAction";

@Injectable()
export class ContainerTypesService extends BaseService {
    private containerTypesUrl: string = environment.apiUrl + "/containerTypes";
        constructor(public http: Http) { 
        super(http);
    }

    getContainerTypes(): Observable<IContainerType[]> {
        return this.query(new GetContainerTypesAction());
    }
}
