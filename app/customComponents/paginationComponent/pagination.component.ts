import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PagedSearch, PaginationObjectInfo } from '../../models/container-page-wrapper';
import { ModalWindowService } from '../../services/modalWindow.service';

@Component({
    selector: 'pagination-component',
    templateUrl: 'pagination.component.html',
    styleUrls: ['pagination.component.css']
})

export class PaginationComponent {
    @Input() info: PaginationObjectInfo;

    @Output() sendData = new EventEmitter<PagedSearch>();

    private totalItemsNumber = 0;

    private requestObjectSentToServer: PagedSearch = new PagedSearch();

    private previousTimeClick = null;

    private limit = 1;

    private pageSizes = [5, 10, 20, 50, 100];
    private currentPageSize: number;

    constructor(private modalWindowService: ModalWindowService) {
        this.currentPageSize = 10;
    }

    initVars() {
        this.requestObjectSentToServer.currentPage = this.info.currentPage - 1;
        this.requestObjectSentToServer.itemsPerPage =  this.getPredefinedPageSize(this.info.itemsOnPage);
    }

    showFirstPage() {
        let interval = this.limit + 1;
        if (this.previousTimeClick != null) {
            interval = new Date().getTime() - this.previousTimeClick;
        }

        if (interval >= this.limit) {
            this.initVars();
            this.info.isLast = false;
            this.info.isFirst = true;
            this.requestObjectSentToServer.currentPage = 0;
            this.sendData.emit(this.requestObjectSentToServer);
            this.previousTimeClick = new Date().getTime();
        }
    }

    showPreviousPage() {
        let interval = this.limit + 1;
        if (this.previousTimeClick != null) {
            interval = new Date().getTime() - this.previousTimeClick;
        }

        if (interval >= this.limit) {
            this.initVars();
            if (this.requestObjectSentToServer.currentPage > 0) {
                this.requestObjectSentToServer.currentPage--;
            }

            if (this.requestObjectSentToServer.currentPage === 0) {
                this.info.isFirst = true;
            } else {
                this.info.isLast = false;
            }
            this.sendData.emit(this.requestObjectSentToServer);

            this.previousTimeClick = new Date().getTime();
        }
    }

    gotoPage() {
        this.initVars();
        let page = this.info.currentPage;
        if (isNaN(page)) {
            this.modalWindowService.show('Error in pagination', ['Incorrect number of a page']);
            return;
        }
        if ((page > this.getTotalPagesNumber() + 1) || (page < 1)) {
            // adding 1 is needed because in a server it works with 0 based logic and in front-end with 1 based login
            this.modalWindowService.show('Error in pagination', ['Page number is out of range']);
            return;
        }
        this.info.isFirst = false; this.info.isLast = false;
        if (page === 1) {
            this.info.isFirst = true;
        }
        if (page === this.getTotalPagesNumber() + 1) {
            // adding 1 is needed because in a server it works with 0 based logic and in front-end with 1 based login
            this.info.isLast = true;
        }

        this.requestObjectSentToServer.currentPage = page - 1; // substructing 1 is needed because in a server it works with 0 based logic and in front-end with 1 based login         
        this.sendData.emit(this.requestObjectSentToServer);

    }

    showNextPage() {
        let interval = this.limit + 1;
        if (this.previousTimeClick != null) {
            interval = new Date().getTime() - this.previousTimeClick;
        }

        if (interval >= this.limit) {

            this.initVars();

            this.info.isFirst = false;

            this.requestObjectSentToServer.currentPage++;
            if (this.requestObjectSentToServer.currentPage === this.getTotalPagesNumber()) {
                this.info.isLast = true;
            }
            this.sendData.emit(this.requestObjectSentToServer);

            this.previousTimeClick = new Date().getTime();
        }
    }

    showLastPage() {
        let interval = this.limit + 1;
        if (this.previousTimeClick != null) {
            interval = new Date().getTime() - this.previousTimeClick;
        }

        if (interval >= this.limit) {
            this.initVars();
            this.info.isLast = true;
            this.info.isFirst = false;
            this.requestObjectSentToServer.currentPage = this.getTotalPagesNumber();
            this.sendData.emit(this.requestObjectSentToServer);

            this.previousTimeClick = new Date().getTime();
        }

    }

    getTotalPagesNumber(): number {
        return Math.ceil(this.info.totalItemsNumber / this.info.itemsOnPage) - 1; // substructing 1 is needed because in a server it works with 0 based logic and in front-end with 1 based login
    }

    onPageSizeChange() {
        this.requestObjectSentToServer.itemsPerPage = this.currentPageSize;

        if (this.currentPageSize * this.info.currentPage > this.info.totalItemsNumber) {
             this.requestObjectSentToServer.currentPage = Math.ceil(this.info.totalItemsNumber / this.currentPageSize) - 1;
        }

        this.sendData.emit(this.requestObjectSentToServer);
    }

    private getPredefinedPageSize(size: Number) {
        for (let i = 0; i < this.pageSizes.length; i++) {
            if (size <= this.pageSizes[i]) {
                return this.pageSizes[i];
            }
        }
        return this.pageSizes[this.pageSizes.length - 1];
    }
}
