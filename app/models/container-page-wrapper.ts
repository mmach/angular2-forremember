import { IContainer } from "./container";
import { IConcept } from "./concept";

export class PaginationObjectInfo {
    itemsOnPage: number;
    currentPage: number;
    startItem: number;
    endItem: number;
    totalItemsNumber: number;
    showNavigation: boolean = false;

    isFirst: boolean;
    isLast: boolean;

    itemType: string;
}

export class ContainerPageWrapper {
    pageInfo: PaginationObjectInfo;
    listOfPaginatedObjects: IContainer[];
}

export class ConceptPageWrapper {
    pageInfo: PaginationObjectInfo;
    listOfPaginatedObjects: IConcept[];
}

export class PagedSearch {
    currentPage: number;
    itemsPerPage: number;
    search: string;
    sorting: string;
    freezerID: number;    
}

export class ContainersPagedSearch extends PagedSearch {
    freezerID: number;
    containerTypeId: number;
    expirationFilter: string;
    usedUpFilter: string;
    transitionID: number;        
}

export class ConceptsPagedSearch extends PagedSearch {
    search: string;
    conceptTypeId: number;  
}
