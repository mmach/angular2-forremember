import { Component, OnInit, AfterViewInit, ViewChild, QueryList, ViewChildren, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalVars } from '../global-vars';
import {
    IContainer, ContainerDetails, ContainerTypeEnum,
    Transition, ContainersService, ContainersPagedSearch, PaginationObjectInfo,
    IFreezer, LocationFilter
} from '../models';
import {
    ConfirmDialogProperties, OverlayWrapperComponent, Preloader,
    BaseModal, ConsumeComponent
} from '../customComponents';
import { ContainerDetailsComponent, ContainerTakeOutComponent, ContainerPutInComponent } from './';

import { FreezersService, ModalWindowService, CqrsService } from '../services';

@Component({
    templateUrl: 'containers-list.component.html',
    styleUrls: ['containers-list.component.css']
})
export class ContainersListComponent implements OnInit, OnDestroy, AfterViewInit {
    searchText: string;

    errorMessage: string;
    containers: IContainer[];
    locationFilter: LocationFilter;
    expirationFilter: number = 0;
    usedUpFilter: number = 0;
    containerTypeFilter = 0;
    locationFilterItems: LocationFilter[] = new Array<LocationFilter>();
    isLoading: boolean = true;

    doCorrectActionDropdown = false;

    resizeTimer;

    private requestObjectSentToServer: ContainersPagedSearch;

    public pageInfo: PaginationObjectInfo = new PaginationObjectInfo();

    rowHeight: number = 63;

    popUpHeight: number = 192; // the height of the popUp window. No way to detect its height was found. TODO find this way

    @ViewChildren(BaseModal)
    private modals: QueryList<BaseModal>;

    @ViewChild(Preloader)
    private preloader: Preloader;

    @ViewChildren(OverlayWrapperComponent)
    private overlayWrapperComponent: QueryList<OverlayWrapperComponent>;

    @ViewChild(ContainerTakeOutComponent)
    private containerTakeOutComponent: ContainerTakeOutComponent;

    @ViewChild(ContainerPutInComponent)
    private containerPutInComponent: ContainerPutInComponent;

    @ViewChild(ContainerDetailsComponent)
    private сontainerDetailsComponent: ContainerDetailsComponent;

    @ViewChild(ConsumeComponent)
    private consumeComponent: ConsumeComponent;

    //sorting
    sortExpirationDateMarker: string = "↑";    
    sortUpdateTimeMarker: string = "";

    constructor(
        private containersService: ContainersService,
        public router: Router,
        private globalVariablesObject: GlobalVars,
        private modalWindowService: ModalWindowService,
        private freezersService: FreezersService,
        private cqrsService: CqrsService) {

        this.requestObjectSentToServer = new ContainersPagedSearch();
        this.requestObjectSentToServer.currentPage = this.globalVariablesObject.currentPageContainer;
        this.requestObjectSentToServer.itemsPerPage = 10;
        this.requestObjectSentToServer.search = '';
        this.locationFilterItems.push(new LocationFilter('all', '(All locations)'));
        this.locationFilterItems.push(new LocationFilter('transition', 'Magazine', Transition.Magazine));
        this.locationFilterItems.push(new LocationFilter('transition', 'Out of freezer', Transition.OutOfFreezer));
        this.locationFilter = this.locationFilterItems[0];
    }

    ngOnInit() {
        this.requestObjectSentToServer.itemsPerPage = this.recalculateRowNumbers(this.rowHeight);
        this.calculateTableHeight();
        this.requestObjectSentToServer.currentPage = this.globalVariablesObject.currentPageContainer;        

        this.updateSortingNavigatedFrom();
        this.getContainers(this.requestObjectSentToServer);

        this.freezersService
            .getFreezers()
            .subscribe(p => {
                let sorted = p.sort((a, b) => a.fullPath > b.fullPath ? 1 : -1)
                    .map(x => LocationFilter.fromFreezer(x));
                this.locationFilterItems = this.locationFilterItems.concat(sorted);
            },
            e => {
                this.errorHandler(e);
            });
    }

    ngAfterViewInit() {
        //document.getElementById('containersTable').style.minHeight = this.popUpHeight + 4 * this.rowHeight + "px"; 
        // need to calculate a minimum page height which is the height of 3 rows + some space for the popup menu
        // to be possible to present. 

        this.calculateTableHeight = this.calculateTableHeight.bind(this);
        window.addEventListener('resize', this.calculateTableHeight, false);
        this.updateSortMarkers();
    }

    ngOnDestroy() {
        window.removeEventListener('resize', this.calculateTableHeight, false);
    }

    calculateTableHeight(): void {
        let bottomSpace = 15; // px
        let tableHeaderTop = $('.table thead').offset().top;
        let headerHeight = $('.table thead').outerHeight();
        let paginationBarHeight = $('.paginationBar').outerHeight();
        let tbodyHeight = window.innerHeight - tableHeaderTop - headerHeight - paginationBarHeight - bottomSpace;
        $('.table tbody').css('height', `${tbodyHeight}px`);
        $('.table tfoot').css('top', `${tableHeaderTop + headerHeight + tbodyHeight - 94}px`);
        $('#containersTable').css('height', `${headerHeight + tbodyHeight + paginationBarHeight}px`);
    }


    recalculateRowNumbers(rowHieght: number) {
        // we want to make some space beteween the pagination line and the bottom of a table.
        let topTable = document.getElementById('containersTable').getBoundingClientRect().top + rowHieght;

        let bottomPageBar = window.innerHeight - 50; // 50 is the height of the pagination bar. TODO think if this might change???

        if (Math.floor((bottomPageBar - topTable) / rowHieght) > 0) {
            return Math.floor((bottomPageBar - topTable) / rowHieght);
        } else {
            return 1;
        }
    }

    private getContainers(search: ContainersPagedSearch) {

        this.preloader.show(null, 500);

        // save the itemsPerPage state here for correct work of filters
        this.requestObjectSentToServer.itemsPerPage = search.itemsPerPage;
        this.requestObjectSentToServer.currentPage = search.currentPage;

        search.search = this.requestObjectSentToServer.search;
        search.freezerID = this.requestObjectSentToServer.freezerID;
        search.transitionID = this.requestObjectSentToServer.transitionID;
        search.expirationFilter = this.requestObjectSentToServer.expirationFilter;
        search.usedUpFilter = this.requestObjectSentToServer.usedUpFilter;
        search.containerTypeId = this.getContainerTypeFilter();

        this.globalVariablesObject.currentPageContainer = search.currentPage;

        search.sorting = this.globalVariablesObject.containersListSortParameters;

        this.cqrsService.execute('GetContainersDetailsAction', search)
            .subscribe(result => {
                if (this.router.url === "/containers") {
                    this.updateContainersTable(result);
                    this.preloader.hide();
                }
            },
            error => {
                console.error(error);
                this.preloader.hide();
            });
    }

    private getContainerTypeFilter(): any {
        if (this.containerTypeFilter === 0)
            return null;
        else
            return this.containerTypeFilter;
    }

    private updateContainersTable(containers) {

        this.pageInfo = containers.pageInfo;
        // this.pageInfo.showNavigation = containers.pageInfo.itemsOnPage < containers.pageInfo.totalItemsNumber;

        this.pageInfo.itemType = 'Containers';

        ////////////////////////////////////////////////////////////////////////////////////////////
        /// This block is for detecting how many containeisSplitCompoundActionEnabledrs are on a page. If there are less than 3
        /// some space for the action menu of a container should be saved
        ////////////////////////////////////////////////////////////////////////////////////////////

        let containerTable = document.getElementById('containersTable');

        if (containerTable) {
            if (containers.pageInfo.endItem - containers.pageInfo.startItem < 3) {
                containerTable.style.height = this.rowHeight * 5 + 'px';
            } else {
                let tableTop = containerTable.getBoundingClientRect().top;
                let tableBottom = window.innerHeight;

                containerTable.style.height = tableBottom - tableTop + 'px';
            }
        }

        containers.listOfPaginatedObjects = containers.listOfPaginatedObjects.map(container => {

            if (container.freezer) {
                container.freezer = new IFreezer(container.freezer);
            }

            if (container.expirationDate) {
                let expirationDateIso = new Date(container.expirationDate);
                container.expirationDate = expirationDateIso.toLocaleDateString();
                // expression becomes true in midnight when current date becomes bigger then expiration date
                container.isExpired = (new Date().valueOf() - expirationDateIso.valueOf()) > 0;
            }
            
            return new ContainerDetails(container);
        });
        this.pageInfo.isFirst = containers.pageInfo.currentPage === 1;
        this.pageInfo.isLast = containers.pageInfo.totalItemsNumber === containers.pageInfo.endItem;
        this.loadComplete(containers.listOfPaginatedObjects);
    }

    loadContainers(search: string = this.searchText) {

        if (this.requestObjectSentToServer.search !== search) {
            this.requestObjectSentToServer.currentPage = 0;
            this.requestObjectSentToServer.search = search;
        }

        this.requestObjectSentToServer.freezerID = this.locationFilter.getFreezerID();
        this.requestObjectSentToServer.transitionID = this.locationFilter.getTransitionID();
        this.requestObjectSentToServer.expirationFilter = this.getExpirationFilter();
        this.requestObjectSentToServer.usedUpFilter = this.getUsedUpFilter();

        //if (this.requestObjectSentToServer.currentPage == 0)
        //    this.requestObjectSentToServer.currentPage = this.globalVariablesObject.currentPageContainer;

        //this.requestObjectSentToServer.itemsPerPage = this.recalculateRowNumbers(this.rowHeight);
        //console.log(this.requestObjectSentToServer);
        this.getContainers(this.requestObjectSentToServer);
    }

    getExpirationFilter(): string {
        switch (this.expirationFilter) {
            case 0: return '';
            case 1: return 'expired';
            case 2: return 'not expired';
        }
    }

    getUsedUpFilter(): string {
        switch (this.usedUpFilter) {
            case 0: return '';
            case 1: return 'usedUp';
            case 2: return 'notUsedUp';
        }
    }

    getDate(date: Date) {
        let d = new Date(date.toString());
        return d.toLocaleString();
    }

    loadComplete(containers) {
        this.containers = containers;
        this.isLoading = false;
    }

    errorHandler(error) {
        this.errorMessage = <any>error;
        this.isLoading = false;
    }

    dropDown(e) {

        document.getElementById('containersTable').style.minHeight = this.rowHeight * 4 + this.popUpHeight + "px";
        let button = e.target || e.srcElement;
        let buttonHeight = button.offsetParent.getBoundingClientRect().bottom;

        let tableBottomY = document.getElementById('containersTable').getBoundingClientRect().bottom - 60; // the bottom y of the table = its height + its top right x corner
        let overflow = tableBottomY - buttonHeight;

        this.doCorrectActionDropdown = overflow < this.popUpHeight;
    }

    delete(container: IContainer) {
        let confirmDialogProperties = new ConfirmDialogProperties();
        confirmDialogProperties.isReasonMandatory = true;
        confirmDialogProperties.showPredefinedReasons = true;
        confirmDialogProperties.predefinedReasonList = ['broken', 'used up', 'sample expired'];
        confirmDialogProperties.showReasonArea = true;

        let thisRef = this;
        confirmDialogProperties.onConfirmed = function () {

            container.isDeleted = true;
            container.reason = this.reasonText;

            //ToDo Don't know if it works the same way like previously

            thisRef.containersService.DeleteContainer(container).subscribe(
                response => {
                    //thisRef.modalWindow.show("Deleting container", "The container with deleted");
                    thisRef.loadContainers();
                },
                error => {
                    this.errorMessage = <any>error;
                });
        };
        let title = `Delete container '${container.barCode}'`;
        let message = ['Are you sure you want to delete this container?'];
        this.modalWindowService.show(title, message, undefined, confirmDialogProperties);
    }


    splitCompound(container: IContainer) {
        let splitCompound = `/container/split/${container.containerID}`;
        this.router.navigate([splitCompound]);
    }

    takeOutContainer(container: IContainer) {
        let title = `Take the container '${container.barCode}' out?`;
        this.containerTakeOutComponent.reason = '';
        this.containerTakeOutComponent.container = container;
        this.getModal('takeOutContainer').show(title);
    }

    takeOutContainerConfirm() {
        if (!this.containerTakeOutComponent.validate()) return;

        this.containersService.takeOut(this.containerTakeOutComponent.container).subscribe(
            response => {
                this.loadContainers();
                this.getModal('takeOutContainer').hide();
            },
            error => this.errorMessage = <any>error
        );
    }

    putInContainer(container: IContainer) {
        let title = `Put container ${container.barCode} in a freezer`;
        this.getModal('putInContainer').show(title);
        this.containerPutInComponent.loadData(container);
    }

    putInContainerConfirm() {
        let container = this.containerPutInComponent.container;
        let freezer = this.containerPutInComponent.destinationFreezer;
        let position = this.containerPutInComponent.getPosition();
        let parentContainerID = this.containerPutInComponent.getParentContainerID();

        if (!this.containerPutInComponent.validate()) {
            return;
        }

        this.containersService.putInFreezer(container, freezer, parentContainerID, position)
            .subscribe(response => {
                this.loadContainers();
                this.getModal('putInContainer').hide();
            });
    }

    showDetails(event, container: IContainer) {
        let detailOverlayPanel = this.overlayWrapperComponent.toArray()[1];
        detailOverlayPanel.width = window.innerWidth * (2 / 5);
        detailOverlayPanel.openOverlayPanel(event);

        this.сontainerDetailsComponent.loadData(container);
        console.log(container);
    }

    getModal(modalName) {
        return this.modals.filter(item => item.modalToShow === modalName)[0];
    }

    private onConsumeCompoundDropdownAction(container: IContainer) {
        this.getModal('consume').show(`Consume compound from container '${container.barCode}'`);

        this.consumeComponent.initialize(container);
    }

    onConsumeCompoundConfirmed() {
        if (!this.consumeComponent.validate()) return;

        this.getModal('consume').hide();
        let consumedContainer = this.consumeComponent.consumedContainer;
        consumedContainer.reason = this.consumeComponent.reason;
        consumedContainer.amount = this.consumeComponent.calculateAmountLeft();

        this.containersService.ConsumeFromContainer(consumedContainer).subscribe(
            response => {
                //thisRef.modalWindow.show("Deleting container", "The container with deleted");
                this.loadContainers();
            },
            error => {
                this.errorMessage = <any>error;
            });
    }

    ///
    /// this method redirects to the separete view with the form to move a container. The id parameter of moving container is passed to the form.
    /// TODO it suppose to be an id of the source freezer passed to the moving freezer form as well with an id of a container that is moved so to pass
    /// the correct parammeters to the method that retrives short freezer version objects (id, name and free space).
    ///
    move(container: IContainer) {
        if (container.transition !== Transition.InFreezer)
            return false;
        this.globalVariablesObject.sourceFreezerInContainerMovement = container.freezerID;
        this.router.navigateByUrl(`/movecontainer/${container.containerID}`);
    }

    search(term, timeout = 1000) {
        this.updateContainersList(term, timeout);
        this.overlayWrapperComponent.toArray()[0].closeOverlayPanel();
    }

    private updateContainersList(term, timeout) {
        let timerCallback = () => {
            this.requestObjectSentToServer.currentPage = 0;
            this.globalVariablesObject.currentPageContainer = 0;
            this.loadContainers(term);
        };
        setTimeout(timerCallback, timeout);
    }

    onLocationClick(fullPath, barCode, typeName) {
        this.modalWindowService.show(`${typeName} ${barCode}`, [fullPath]);
    }

    openFilterPanel(event) {
        this.overlayWrapperComponent.toArray()[0].openOverlayPanel(event);
    }

    resetFilters() {
        this.searchText = '';
        this.locationFilter = this.locationFilterItems[0];
        this.containerTypeFilter = 0;
        this.expirationFilter = 0;
        this.usedUpFilter = 0;
        this.search(null);
    }

    onSearchInputSubmit(event) {
        if (event.keyCode === 13) {
            this.search(event.srcElement.value, 0);
        }
    }

    isChangeContainerLocationActionEnabled(container: ContainerDetails): boolean {
        return container.transition === Transition.InFreezer &&
            !container.isUsedUp &&
            !container.isExpired;
    }

    isSplitCompoundActionEnabled(container: ContainerDetails): boolean {
        return container.transition === Transition.OutOfFreezer &&
            !container.isUsedUp &&
            container.containerType.containerTypeID !== ContainerTypeEnum.PlateWithWells &&  // disable split compound for plates
            !container.isExpired &&
            container.containerType.containerTypeID !== ContainerTypeEnum.Rack; // disable split compound for plates

    }

    isTakeContainerOutActionEnabled(container: ContainerDetails): boolean {
        return container.transition === Transition.InFreezer &&
            !container.isUsedUp &&
            !container.isExpired;
    }

    isConsumeCompoundActionEnabled(container: ContainerDetails): boolean {
        return container.transition === Transition.OutOfFreezer &&
            !container.isUsedUp &&
            !container.isExpired &&
            container.containerTypeID !== ContainerTypeEnum.Rack;
    }

    isPutContainerInFreezerActionEnabled(container: ContainerDetails): boolean {
        return container.transition === Transition.OutOfFreezer &&
            !container.isUsedUp &&
            !container.isExpired;
    }

    //sorting helper methods
    private updateSortMarkers() {                
        if (this.globalVariablesObject.containersListSortParameters.indexOf("ExpirationDate.ASC") > -1) {            
            this.sortExpirationDateMarker = "↑";
            this.sortUpdateTimeMarker = "";
        }
        else if (this.globalVariablesObject.containersListSortParameters.indexOf("ExpirationDate.DESC") > -1) {            
            this.sortExpirationDateMarker = "↓";
            this.sortUpdateTimeMarker = "";
        }
        else if (this.globalVariablesObject.containersListSortParameters.indexOf("UpdateTime.ASC") > -1) {            
            this.sortUpdateTimeMarker = "↑";
            this.sortExpirationDateMarker = "";
        }
        else if (this.globalVariablesObject.containersListSortParameters.indexOf("UpdateTime.DESC") > -1) {            
            this.sortUpdateTimeMarker = "↓";
            this.sortExpirationDateMarker = "";
        }
    }

    toggleSortExpirationDate() {
        //we need to reset pagination when changing sorting column
        if (this.globalVariablesObject.containersListSortParameters.indexOf("ExpirationDate") < 0) {
            this.globalVariablesObject.currentPageContainer = 0;
        }

        if (this.globalVariablesObject.containersListSortParameters == "ExpirationDate.ASC") {
            this.globalVariablesObject.containersListSortParameters = "ExpirationDate.DESC";
        }
        else {
            this.globalVariablesObject.containersListSortParameters = "ExpirationDate.ASC";
        }

        this.updateSortMarkers();

        this.requestObjectSentToServer.currentPage = this.globalVariablesObject.currentPageContainer;
        this.getContainers(this.requestObjectSentToServer);
    }

    toggleSortUpdateTime() {
        //we need to reset pagination when changing sorting column
        if (this.globalVariablesObject.containersListSortParameters.indexOf("UpdateTime") < 0) {
            this.globalVariablesObject.currentPageContainer = 0;
        }

        if (this.globalVariablesObject.containersListSortParameters == "UpdateTime.ASC") {
            this.globalVariablesObject.containersListSortParameters = "UpdateTime.DESC";           
        }
        else {
            this.globalVariablesObject.containersListSortParameters = "UpdateTime.ASC";            
        }

        this.updateSortMarkers();

        this.requestObjectSentToServer.currentPage = this.globalVariablesObject.currentPageContainer;     
        this.getContainers(this.requestObjectSentToServer);
    }

    updateSortingNavigatedFrom() {
        if (this.globalVariablesObject.lastNavigatedFromAction.indexOf("CreateContainerSuccess") > -1) {
            this.globalVariablesObject.containersListSortParameters = "UpdateTime.DESC";
            this.globalVariablesObject.lastNavigatedFromAction = "";

            this.updateSortMarkers();            
        }
    }
}
