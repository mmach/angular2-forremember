import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { ILocation } from "../models/location";
import { EditLocationDecorator } from "../models/editlocationdecorator";
import { environment } from "../environment";

import { GetLocationsAction } from "../models/actions/GetLocationsAction";
import { GetAdditonalLocationInfoEditAction } from "../models/actions/GetAdditonalLocationInfoEditAction"; 
import { GetAdditonalLocationInfo } from "../models/actions/GetAdditonalLocationInfo"; 
import { GetLocationAction } from "../models/actions/GetLocationAction"; 
import { GetAdditonalLocationInfoAction } from "../models/actions/GetAdditonalLocationInfoAction";

import { CreateOfficeAction } from "../models/actions/CreateOfficeAction";
import { CreateCityAction } from "../models/actions/CreateCityAction";

import { UpdateOfficeAction } from "../models/actions/UpdateOfficeAction";
import { UpdateCityAction } from "../models/actions/UpdateCityAction";

import { BaseService } from "../services/base.service";

@Injectable()
export class LocationsService extends BaseService {
    constructor(public http: Http) { 
        super(http);
    }

    getAllLocations(): Observable<ILocation[]> {
        return this.query(new GetLocationsAction());
    }

    decorateEditingLocationForm(id: number, add: boolean): Observable<EditLocationDecorator> {
        let action = add ? new GetAdditonalLocationInfoAction(id) : new GetAdditonalLocationInfoEditAction(id)

        return this.query(action);
    }
    
    getLocationById(id: number): Observable<ILocation> {
        return this.query(new GetLocationAction(id));
    }
    
    createCity(location: ILocation): Observable<any> {
        return this.command(new CreateCityAction(location));
    }

    createOffice(location: ILocation): Observable<any> {
        return this.command(new CreateOfficeAction(location));
    }

    updateCity(location: ILocation): Observable<any> {
        return this.command(new UpdateCityAction(location));
    }

    updateOffice(location: ILocation): Observable<any> {
        return this.command(new UpdateOfficeAction(location));
    }
}
