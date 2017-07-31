import { Component, OnInit, Input } from '@angular/core';
import { LayoutMap, LayoutMapIndexType } from '../models/layoutMap';
import { LayoutMapItem } from '../models/LayoutMapItem';
import { LayoutMapItemView } from '../layout-mapitem-view/layout-mapitem-view.component';

@Component({
    selector: 'layout-map-view',
    templateUrl: 'layout-map-view.component.html',
    styleUrls: ['layout-map-view.component.css']
})

export class LayoutMapView implements OnInit {
    @Input() layoutMap: LayoutMap;

    private currentPositionHTML = '';

    private indexColumns = new Array<LayoutMapColumn>();
    private indexRows = new Array<LayoutMapRow>();

    private columns = new Array<LayoutMapColumn>();
    private rows = new Array<LayoutMapRow>();

    private layoutMapItemMatrix = new Array();

    constructor() {

    }

    ngOnInit() {
        this.render();

        this.layoutMap.columnSizeChanged = () => {
            this.render();
        };

        this.layoutMap.columnIndexTypeChanged = () => {
            this.render();
        };

        this.layoutMap.rowSizeChanged = () => {
            this.render();
        };

        this.layoutMap.rowIndexTypeChanged = () => {
            this.render();
        };

        this.layoutMap.filledItemsCoordinateChanged = () => {
            this.render();
        };

        this.layoutMap.allowMultipleSelectionChanged = () => {
            this.unselectAllItems();
            this.render();
        };

        this.layoutMap.selectAllChanged = () => {
            if (this.layoutMap.selectAll) {
                this.selectAllItems();
            } else {
                this.unselectAllItems();
            }
            this.render();
        };

    }

    ngAfterViewInit() {
        this.generateTooltips();
    }

    public generateTooltips() {
        if ((<any>$)().tooltip) {
            (<any>$('[data-toggle="tooltip"]')).tooltip({ html: true });
        }
    }

    private render() {
        this.columns = [];
        this.indexColumns = [];

        //Columns with index column
        let totalColumnCount = (this.layoutMap.columnSize + 1);

        let columnWidthPercent = (100 / totalColumnCount);
        for (let i = 0; i < this.layoutMap.columnSize; i++) {
            let layoutMapColumn = new LayoutMapColumn();
            layoutMapColumn.DOMStyle = {
                'width': columnWidthPercent + '%'
            };
            this.columns.push(layoutMapColumn);

            let layoutMapIndexColumn = new LayoutMapColumn();
            layoutMapIndexColumn.DOMStyle = {
                'width': columnWidthPercent + '%',
                'text-align': 'center'
            };
            layoutMapIndexColumn.innerHTML = LayoutMap.getIndexFormatted(i, this.layoutMap.columnIndexType);
            this.indexColumns.push(layoutMapIndexColumn);
        }

        //Rows with index row
        this.rows = [];
        this.indexRows = [];

        for (let i = 0; i < this.layoutMap.rowSize; i++) {
            let layoutMapRow = new LayoutMapRow();
            layoutMapRow.DOMStyle = {
                'height': '30px'
            };
            this.rows.push(layoutMapRow);

            let layoutMapIndexRow = new LayoutMapRow();
            layoutMapIndexRow.DOMStyle = {
                'height': '30px',
                'text-align': 'center'
            };
            layoutMapIndexRow.innerHTML = LayoutMap.getIndexFormatted(i, this.layoutMap.rowIndexType);
            this.indexRows.push(layoutMapIndexRow);
        }

        this.generateMapItems();
        this.generateTooltips();
    }

    public generateMapItems() {
        this.layoutMapItemMatrix = new Array();

        for (let i = 0; i < this.columns.length; i++) {

            this.layoutMapItemMatrix[i] = new Array();

            for (let j = 0; j < this.rows.length; j++) {

                let mapItem = this.layoutMap.items.filter(a => a.columnIndex == i && a.rowIndex == j)[0];
                if (!mapItem) {
                    mapItem = new LayoutMapItem();
                    mapItem.columnIndex = i;
                    mapItem.rowIndex = j;
                    this.layoutMap.items.push(mapItem);
                }

                mapItem.allowSelect = true;
                mapItem.filledBackgroundColor = this.layoutMap.filledBackgroundColor;
                mapItem.selectedBackgroundColor = this.layoutMap.selectedBackgroundColor;
                mapItem.availableBackgroundColor = this.layoutMap.availableBackgroundColor;

                this.layoutMapItemMatrix[i][j] = mapItem;
            }
        }
    }

    private cellChange(arg: LayoutMapItem) {
        this.currentPositionHTML = LayoutMap.getIndexFormatted(arg.rowIndex, this.layoutMap.rowIndexType) + ',' + LayoutMap.getIndexFormatted(arg.columnIndex, this.layoutMap.columnIndexType);
    }

    private cellSelected(arg: LayoutMapItem) {
        if (!this.layoutMap.allowMultipleSelection) {
            for (let i = 0; i < this.layoutMap.items.length; i++) {
                let currentItem = this.layoutMap.items[i];
                if (!(currentItem.columnIndex == arg.columnIndex && currentItem.rowIndex == arg.rowIndex)) {
                    currentItem.allowSelect = false;
                    this.layoutMap.selectAll = false;
                }
            }
        }
    }

    private cellUnSelected(arg: LayoutMapItem) {
        if (!this.layoutMap.allowMultipleSelection) {
            for (let i = 0; i < this.layoutMap.items.length; i++) {
                let currentItem = this.layoutMap.items[i];
                if (!(currentItem.columnIndex == arg.columnIndex && currentItem.rowIndex == arg.rowIndex)) {
                    currentItem.allowSelect = true;
                }
            }
        }
    }

    private cellMouseLeave(arg: LayoutMapItem) {
        this.currentPositionHTML = '';
    }

    private selectAllItems() {
        for (let i = 0; i < this.layoutMap.items.length; i++) {
            if (this.layoutMap.items[i].isEmpty) {
                this.layoutMap.items[i].isSelected = true;
            }
        }
    }

    private unselectAllItems() {
        for (let i = 0; i < this.layoutMap.items.length; i++) {
            this.layoutMap.items[i].isSelected = false;
        }
        this.currentPositionHTML = '';
    }
}

export class LayoutMapColumn {
    DOMStyle: any;
    innerHTML: string;
}

export class LayoutMapRow {
    DOMStyle: any;
    innerHTML: string;
}
