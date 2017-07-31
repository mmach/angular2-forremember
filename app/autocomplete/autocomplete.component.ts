import { Component, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AutocompleteData } from '../models/container';
import { ContainersPagedSearch } from '../models/container-page-wrapper';
import { ContainersMagazineOrRackSource } from '../services/ContainersMagazineOrRackSource';

@Component({
    selector: 'autocomplete',
    templateUrl: 'autocomplete.component.html',
    styleUrls: ['autocomplete.component.css'],
    host: {
        '(document:click)': 'handleClick($event)',
        '(keydown)': 'handleKeyDown($event)'
    }
})
export class Autocomplete implements OnInit {
    @Input() allowedPrefixes: Array<string> = [];
    @Input() initialValue = '';
    @Input() transitionId;
    @Output() change = new EventEmitter<any>();
    @Output() close = new EventEmitter<any>();
    query: string;
    filteredList: any[] = [];
    pos: number = -1;
    opened: boolean = false;
    selectedItem: any;
    item: any;
    items: AutocompleteData[] = [];
    resultLimit = 10;
    isResultLimitExceeded: boolean = false;

    constructor(private elementRef: ElementRef,
                private containersSource: ContainersMagazineOrRackSource) {
    }

    ngOnInit() {
        this.query = this.initialValue;
    }

    public setBarcode(barcode: string) {
        this.query = barcode;
    }

    private onInputKeyUp(event: any) {
        if (this.query !== '') {
            if (this.opened) {
                if ((event.keyCode >= 48 && event.keyCode <= 57) ||
                   (event.keyCode >= 65 && event.keyCode <= 90) ||
                   (event.keyCode == 8))
                   {
                       this.pos = 0;
                       this.filterQuery();
                   }
                else if (event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13) {
                    this.filteredList = this.items;
                }
            } else {
                this.filterQuery();
            }
        } else {
            if (this.opened) {
                this.filteredList = this.items;
            } else {
                this.filteredList = [];
            }
        }

        for (let i = 0; i < this.filteredList.length; i++) {
            this.filteredList[i].selected = false;
        }

        if (this.selectedItem) {
            this.filteredList.map(i =>
                {
                    if (i.id == this.selectedItem.id)
                      this.pos = this.filteredList.indexOf(i);
                }
            );
            this.selectedItem = null;
        }

        // Arrow-key Down
        if (event.keyCode == 40) {
            if (this.pos + 1 != this.filteredList.length)
                this.pos++;
        }

        // Arrow-key Up
        if (event.keyCode == 38) {
            if (this.pos > 0)
                this.pos--;
        }

        if (this.filteredList[this.pos] !== undefined)
            this.filteredList[this.pos].selected = true;

        //enter
        if (event.keyCode == 13) {
            if (this.filteredList[this.pos] !== undefined) {
                this.select(this.filteredList[this.pos]);
            }
        }

        // Handle scroll position of item
        let listGroup = document.getElementById('list-group');
        let listItem = document.getElementById('true');
        if (listItem)
            listGroup.scrollTop = (listItem.offsetTop - 100);
    }

    private filterQuery() {
        this.notifyParent();
        if (this.query.length >= 3)
            this.filteredList = this.getItemsList(this.query);
        else
            this.filteredList = [];
    }

    private getItemsList(query: string): any[] {
        if (!this.isQueryPrefixPermitted(query)) return [];

        let search = new ContainersPagedSearch();
        search.search = query;
        search.currentPage = 0;
        search.itemsPerPage = this.resultLimit + 1;
        search.transitionID = this.transitionId;
        this.containersSource
            .getContainers(search)
            .subscribe(p => {
                    this.filteredList = p.listOfPaginatedObjects.slice(0, this.resultLimit).map(e => new AutocompleteData(e.containerID, e.barCode));
                    this.isResultLimitExceeded = p.listOfPaginatedObjects.length > this.resultLimit;
                },
                e => console.log(e)
            );
        this.items = this.filteredList;
        return this.filteredList;
    }

    private isQueryPrefixPermitted(query: string): boolean {
        let queryPrefix = query.slice(0, 2).toLowerCase();
        return this.allowedPrefixes.indexOf(queryPrefix) != -1;
    }

    private notifyParent() {
        this.change.emit({value: this.query});
    }

    private select(item: any) {
        this.selectedItem = item;
        this.selectedItem.selected = true;
        this.query = item.name;
        this.filteredList = [];
        this.notifyParent();
    }

    private showAll(input: any) {
        input.select();

        if (this.filteredList.length > 0) {
            this.opened = false;
            this.filteredList = [];
        } else {
            this.opened = true;
            this.filteredList = this.items;
        }
        if (this.query === '') {
            this.clearAll();
        }

        this.clearSelects();
    }

    private handleKeyDown(event: any) {
        // Prevent default actions of arrows
        if (event.keyCode == 40 || event.keyCode == 38)
            event.preventDefault();
    }

    private clearAll() {
        if (this.filteredList) {
            for (let i = 0; i < this.filteredList.length; i++)
                this.filteredList[i].selected = false;
        }
    }

    /** Remove selected from all items of the list **/
    private clearSelects() {
        if (this.selectedItem) {
            for (let i = 0; i < this.filteredList.length; i++) {
                if (this.filteredList[i].id != this.selectedItem.id)
                    this.filteredList[i].selected = false;
                }
        }
    }

    /** Handle outside click to close suggestions**/
    private handleClick(event: any) {
       
        let clickedComponent = event.target;
        let inside = false;
        do {
            if (clickedComponent === this.elementRef.nativeElement) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
        if (!inside) {
            this.filteredList = [];
            this.opened = false;
            if (this.query != "pl" && this.query != "")
                this.close.emit({value: this.query});
        }
    }
}
