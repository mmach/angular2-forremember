import { Observable } from 'rxjs/Observable';

import { PagedSearch, ContainerPageWrapper } from "../models/container-page-wrapper";


export interface IContainersAutocompleteSource {
    getContainers(pagedSearch: PagedSearch): Observable<ContainerPageWrapper>;
}
