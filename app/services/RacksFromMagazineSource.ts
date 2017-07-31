import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

import { GetRacksFromMagazineAction } from '../models/actions/containers/GetRacksFromMagazineAction';
import { PagedSearch, ContainerPageWrapper } from '../models/container-page-wrapper';

import { IContainersAutocompleteSource } from './IContainersAutocompleteSource';
import { ContainersMagazineOrRackSource } from './ContainersMagazineOrRackSource';

@Injectable()
export class RacksFromMagazineSource extends ContainersMagazineOrRackSource implements IContainersAutocompleteSource {

    constructor(public http: Http) {
        super(http);
    }

    getContainers(pagedSearch: PagedSearch): Observable<ContainerPageWrapper> {
        return this.query(new GetRacksFromMagazineAction(pagedSearch));
    }
}
