import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';   // Load all features

import { ICustomProperty } from '../models/customproperty';
import { environment } from "../environment";
import { BaseService } from "./base.service";
import { CreatePropertyAction } from '../models/actions/CreatePropertyAction';
import { UpdatePropertyAction } from '../models/actions/UpdatePropertyAction';
import { GetPropertiesAction } from '../models/actions/GetPropertiesAction';
import { DeletePropertyAction } from '../models/actions/DeletePropertyAction';

@Injectable()
export class CustomPropertiesService extends BaseService {
    protected ENDPOINT = environment.apiUrl;
    protected controllerName = "/ConceptCustomProperties";

    constructor(public http: Http) {
        super(http);
    }

    public getAllProperties(parentID: number): Observable<ICustomProperty[]> {
        return this.query(new GetPropertiesAction(parentID))
    }

    public saveProperties(customProperties: ICustomProperty[]) {
        customProperties.filter(p => p.name != null && p.name.trim()!='')
            .forEach(
                prop => {
                    if (prop.isDeleted && !isNaN(prop.parentID) && !isNaN(prop.propertyID))
                    { //delete
                        console.log("deleting");
                        console.log(prop);
                        this.deleteProperty(prop.propertyID);
                    }
                    else if(!prop.isDeleted && isNaN(prop.propertyID))
                    { //add
                        console.log("adding");
                        this.createProperty(prop);
                    }
                    else if(!prop.isDeleted)
                    { // modify
                        console.log("editing");
                        this.updateProperty(prop);
                    }
                    else{console.log("nothing happened");}
                }
                );
    }

    protected deleteProperty(propertyID: number){
        this.command(new DeletePropertyAction(propertyID))
            .subscribe( response => location.reload(),
                    e=> this.handleError(e));
    }

    protected updateProperty(property: ICustomProperty){
        this.command(new UpdatePropertyAction(property))
            .subscribe( response => location.reload(),
                    e=> this.handleError(e));
    }

    protected createProperty(property: ICustomProperty):void {
        this.command(new CreatePropertyAction(property))
            .subscribe( response => location.reload(),
                    e=> this.handleError(e));
    }
}
