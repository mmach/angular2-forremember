import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

import { BaseService } from "../services/base.service";

import { GetContainersInMagazineOrRackAction } from "../models/actions/containers/GetContainersInMagazineOrRackAction";
import { PagedSearch, ContainerPageWrapper } from "../models/container-page-wrapper";

import { IContainersAutocompleteSource } from "./IContainersAutocompleteSource";

@Injectable()
export class ContainersMagazineOrRackSource extends BaseService implements IContainersAutocompleteSource {

    constructor(public http: Http) {
        super(http);
    }
   
    getContainers(pagedSearch: PagedSearch): Observable<ContainerPageWrapper> {
        return this.query(new GetContainersInMagazineOrRackAction(pagedSearch))
    }
}
