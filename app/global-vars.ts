import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVars {
    currentPageContainer: number = 0;
    currentPageConcepts: number = 0;
    sourceFreezerInContainerMovement = -1;
    
    containersListSortParameters: string = "ExpirationDate.ASC";
    conceptsListSortParameters: string = "UpdateTime.ASC";

    lastNavigatedFromAction: string = "";

    locationsTreeState: any = new Set();
}