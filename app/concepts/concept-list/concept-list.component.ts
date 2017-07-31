import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { IConcept } from '../../models/concept';
import { IConceptType } from '../../models/conceptType';
import { ConceptsService } from '../../services/concepts.service';
import { ConceptTypesService } from '../../services/conceptTypes.service';
import { ConfirmDialogProperties } from '../../customComponents/modalWindow/modal-window.component';
import { OverlayWrapperComponent } from '../../customComponents/overlayWrapper/overlayWrapper.component';
import { ModalWindowService } from '../../services/modalWindow.service';
import { UsersService } from '../../services/users.service';
import { Preloader } from '../../customComponents/preloader/preloader.component';

import { GlobalVars } from '.././../global-vars';
import { ConceptsPagedSearch, PaginationObjectInfo } from '../../models/container-page-wrapper';
import { PaginationComponent } from '../../customComponents/paginationComponent/pagination.component';
import { IUser } from '../../models/user';

@Component({
    templateUrl: 'concept-list.component.html',
    styleUrls: ['concept-list.component.css']
})
export class ConceptListComponent implements OnInit, OnDestroy {
    concepts: IConcept[];
    conceptTypes: IConceptType[];
    users: IUser[];
    searchText: string;
    conceptTypeIdFilter: number = 0;

    @ViewChild(PaginationComponent)
    private pagination: PaginationComponent;

    @ViewChild(Preloader)
    private preloader: Preloader;

    @ViewChild(OverlayWrapperComponent)
    private overlayWrapperComponent: OverlayWrapperComponent;

    popUpHeight: number = 102;
    doCorrectActionDropdown = false;
    resizeTimer;

    //sorting
    sortUpdateTimeMarker: string = "↑";

    private requestObjectSentToServer: ConceptsPagedSearch;

    public pageInfo: PaginationObjectInfo = new PaginationObjectInfo();

    rowHeight: number = 63;

    constructor(
        private conceptsService: ConceptsService,
        private conceptTypesService: ConceptTypesService,
        public router: Router,
        private globalVariableObject: GlobalVars,
        private modalWindowService: ModalWindowService,
        private usersService: UsersService) {

        this.requestObjectSentToServer = new ConceptsPagedSearch();
        this.requestObjectSentToServer.currentPage = this.globalVariableObject.currentPageConcepts;
        this.requestObjectSentToServer.sorting = this.globalVariableObject.conceptsListSortParameters;
        this.requestObjectSentToServer.itemsPerPage = 10;
        this.requestObjectSentToServer.search = '';        

        this.conceptTypesService.getConceptTypes()
            .subscribe(ct => { this.conceptTypes = ct; });
    }

    ngOnInit() {
        this.calculateTableHeight();

        this.updateSortingNavigatedFrom();
        this.updateSortMarkers();      
        this.getData(this.requestObjectSentToServer);
        
        this.calculateTableHeight = this.calculateTableHeight.bind(this);
        window.addEventListener("resize", this.calculateTableHeight, false);
    }

    ngOnDestroy() {
        window.removeEventListener("resize", this.calculateTableHeight, false);
    }

    calculateTableHeight(): void {
        let bottomSpace = 15; // px
        let tableHeaderTop = $('.table thead').offset().top;
        let headerHeight = $('.table thead').outerHeight();
        let paginationBarHeight = $('.paginationBar').outerHeight();
        let tbodyHeight = window.innerHeight - tableHeaderTop - headerHeight - paginationBarHeight - bottomSpace;
        $('.table tbody').css('height', `${tbodyHeight}px`);
        $('.table tfoot').css('top', `${tableHeaderTop + headerHeight + tbodyHeight - 94}px`);
    }

    dropDown(e) {
        let button = e.target || e.srcElement;
        let buttonHeight = button.offsetParent.getBoundingClientRect().bottom;

        let tableBottomY = document
            .getElementById('conceptsTable')
            .getBoundingClientRect().bottom; // the bottom y of the table = its height + its top right x corner
        let overflow = tableBottomY - buttonHeight;
        this.doCorrectActionDropdown = overflow < this.popUpHeight;
    }

    getData(req: ConceptsPagedSearch) {

        this.preloader.show(null, 500);

        // save the itemsPerPage state here for correct work of filters
        this.requestObjectSentToServer.itemsPerPage = req.itemsPerPage;
        this.requestObjectSentToServer.currentPage = req.currentPage;

        req.sorting = this.globalVariableObject.conceptsListSortParameters;

        req.search = this.searchText;
        req.conceptTypeId = this.conceptTypeIdFilter;
        this.globalVariableObject.currentPageConcepts = req.currentPage;
        Observable.forkJoin([this.conceptTypesService.getConceptTypes(),
            this.conceptsService.getConceptsWithPages(req),
            this.usersService.getUsers()])
            .subscribe(data => {
                this.conceptTypes = data[0];
                this.pageInfo = data[1].pageInfo;

                this.pageInfo.itemType = 'Concepts';

                this.pageInfo.isFirst = data[1].pageInfo.currentPage === 1;
                this.pageInfo.isLast = data[1].pageInfo.totalItemsNumber === data[1].pageInfo.endItem;

                this.pageInfo.showNavigation = data[1].pageInfo.itemsOnPage < data[1].pageInfo.totalItemsNumber;
                this.concepts = data[1].listOfPaginatedObjects;

                this.users = data[2];
                this.preloader.hide();
            });
    }

    addConcept() {
        this.router.navigateByUrl('conceptAdd');
    }

    editConcept(conceptID: number) {
        this.router.navigateByUrl('conceptedit/' + conceptID);
    }

    doAction(concept: IConcept) {

        if (concept.registered) {
            this.router.navigateByUrl('produce/' + concept.conceptID);
        } else {

            let confirmDialogProperties = new ConfirmDialogProperties();

            let thisRef = this;
            confirmDialogProperties.onConfirmed = function () {
                thisRef.conceptsService.registerConcept(concept).subscribe(
                    response => {
                        if (response.ErrorCode === 0) {
                            thisRef.conceptsService.getConceptByID(concept.conceptID)
                                .subscribe(r => {
                                    concept.registered = r.registered;
                                    concept.registerTime = r.registerTime;
                                    concept.registeredBy = r.registeredBy;
                                    concept.olc = r.olc;
                                });
                        }
                    });
            };

            let title = `Register Concept ${concept.name}`;
            let message = ['Are you sure you want to register this concept?'];
            this.modalWindowService.show(title, message, undefined, confirmDialogProperties);
        }
    }

    getUserNameByID(userID: number) {
        // to do
        let user = this.users.find(p => p.userId === userID);
        return user ? user.name + ' ' + user.surname : '';
    }

    getConceptTypeNameByID(conceptTypeID: number) {
        return this.conceptTypes.find(p => p.conceptTypeID === conceptTypeID).name;
    }

    onFastaButtonClick(fastaString, name) {
        let title = `FASTA for concept ${name} (${fastaString.length} aa)`;
        this.modalWindowService.show(title, [fastaString], { smallText: true });
    }

    getActionName(registered: boolean) {
        return registered ? 'Produce' : 'Register';
    }

    getStatusName(registered: boolean) {
        return registered ? 'Registered' : 'Draft';
    }

    getDate(date: Date) {
        let d = new Date(date.toString());
        return d.toLocaleString();
    }

    deleteConcept(concept: IConcept) {
        let confirmDialogProperties = new ConfirmDialogProperties();

        let thisRef = this;
        confirmDialogProperties.onConfirmed = function () {
            thisRef.conceptsService
                .deleteConcept(concept.conceptID, 0)
                .subscribe(
                response => {
                    if (response.ErrorCode === 0) {
                        location.reload();
                    }
                });
        };
        let title = `Delete Concept ${concept.name}`;
        let message = ['Are you sure you want to delete this concept?'];

        this.modalWindowService.show(title, message, undefined, confirmDialogProperties);
    }

    search(term, timeout = 2000) {
        this.requestObjectSentToServer.search = term;
        this.getData(this.requestObjectSentToServer);
        this.overlayWrapperComponent.closeOverlayPanel();
    }

    openFilterPanel(event) {
        this.overlayWrapperComponent.openOverlayPanel(event);
    }

    resetFilters() {
        this.searchText = '';
        this.conceptTypeIdFilter = 0;
        this.search(this.searchText);
    }

    //sorting helper methods
    private updateSortMarkers() {                
        if (this.globalVariableObject.conceptsListSortParameters.indexOf("UpdateTime.ASC") < 0)
        {                     
            this.sortUpdateTimeMarker = "↓";
        }
        else
        {            
            this.sortUpdateTimeMarker = "↑";
        }        
    }

    toggleSortUpdateTime() {
        if (this.globalVariableObject.conceptsListSortParameters == "UpdateTime.ASC")
        {
            this.globalVariableObject.conceptsListSortParameters = "UpdateTime.DESC";           
        }
        else
        {
            this.globalVariableObject.conceptsListSortParameters = "UpdateTime.ASC";            
        }

        this.updateSortMarkers();          
        this.getData(this.requestObjectSentToServer);
    }

    updateSortingNavigatedFrom() {
        if (this.globalVariableObject.lastNavigatedFromAction.indexOf("CreateConceptSuccess") > -1) {
            this.globalVariableObject.conceptsListSortParameters = "UpdateTime.DESC";
            this.globalVariableObject.lastNavigatedFromAction = "";
        }
    }
}
