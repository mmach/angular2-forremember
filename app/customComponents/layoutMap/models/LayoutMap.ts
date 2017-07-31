import { LayoutMapItem } from '../models/LayoutMapItem';

export class LayoutMap {
    filledItemsCoordinateChanged: any;
    private _filledItemsCoordinates = '';
    get filledItemsCoordinates() {
        if (this._filledItemsCoordinates == '') {
            this._filledItemsCoordinates = this.getFilledMapItems();
        }
        return this._filledItemsCoordinates;
    }
    set filledItemsCoordinates(value) {
        this.setFilledMapItems(value, true);
        if (this.filledItemsCoordinateChanged) {
            this.filledItemsCoordinateChanged();
        }
    }

    columnSizeChanged: any;
    private _columnSize = 12;
    get columnSize() {
        return this._columnSize;
    }
    set columnSize(value) {
        if (value > 20) {
            value = 20;
        }
        else if (value <= 0) {
            value = 0;
        }

        let fireChangedEvent = this._columnSize != value;
        this._columnSize = value;

        if (fireChangedEvent && this.columnSizeChanged) {
            this.columnSizeChanged();
        }
    }

    columnIndexTypeChanged: any;
    private _columnIndexType = LayoutMapIndexType.NUMBER;
    get columnIndexType() {
        return this._columnIndexType;
    }
    set columnIndexType(value) {
        let fireChangedEvent = this._columnIndexType != value;
        this._columnIndexType = value;

        if (fireChangedEvent && this.columnIndexTypeChanged) {
            this.columnIndexTypeChanged();
        }
    }

    allowMultipleSelectionChanged: any;
    private _allowMultipleSelection = false;
    get allowMultipleSelection() {
        return this.showSelectAllCheckbox ? true : this._allowMultipleSelection;
    }
    set allowMultipleSelection(value) {
        let fireChangedEvent = this._allowMultipleSelection != value;
        this._allowMultipleSelection = value;

        if (fireChangedEvent && this.allowMultipleSelectionChanged) {
            this.allowMultipleSelectionChanged();
        }
    }

    rowSizeChanged: any;
    private _rowSize = 8;
    get rowSize() {
        return this._rowSize;
    }
    set rowSize(value) {
        if (value > 20) {
            value = 20;
        }
        else if (value <= 0) {
            value = 0;
        }
        let fireChangedEvent = this._rowSize != value;
        this._rowSize = value;

        if (fireChangedEvent && this.rowSizeChanged) {
            this.rowSizeChanged();
        }
    }

    rowIndexTypeChanged: any;
    private _rowIndexType = LayoutMapIndexType.LETTER;
    get rowIndexType() {
        return this._rowIndexType;
    }
    set rowIndexType(value) {
        let fireChangedEvent = this._rowIndexType != value;
        this._rowIndexType = value;

        if (fireChangedEvent && this.rowIndexTypeChanged) {
            this.rowIndexTypeChanged();
        }
    }

    selectAllChanged: any;
    private _selectAll = false;
    get selectAll() {
        return this._selectAll;
    }
    set selectAll(value) {
        let fireChangedEvent = this._selectAll != value;
        this._selectAll = value;

        if (fireChangedEvent && this.selectAllChanged) {
            this.selectAllChanged();
        }
    }

    showSelectAllCheckbox = false;
    filledBackgroundColor = 'red';
    availableBackgroundColor = 'green';
    selectedBackgroundColor = 'blue';

    DOMStyle: any;

    private _items = new Array<LayoutMapItem>();

    get items() {
        return this._items;
    }
    set items(value) {
        this._items = value;
    }

    static getIndexFromLetter(letter) {
        return 'abcdefghijklmnopqrstuvwxyz'.indexOf(letter);
    }

    public static parsePosition(position: string): number[] {
        position = position.toLowerCase();
        let firstCoordinate = position.split(',')[0];
        let secondCoordinate = position.split(',')[1];

        let rowIndex = -1;
        if (isNaN(parseInt(firstCoordinate))) {
            rowIndex = LayoutMap.getIndexFromLetter(firstCoordinate);
        } else {
            rowIndex = parseInt(firstCoordinate) - 1;
        }

        let columnIndex = -1;
        if (isNaN(parseInt(secondCoordinate))) {
            columnIndex = LayoutMap.getIndexFromLetter(secondCoordinate);
        } else {
            columnIndex = parseInt(secondCoordinate) - 1;
        }

        return [rowIndex, columnIndex];
    }

    static getIndexFormatted(indexAsNumber: number, layoutMapIndexType: LayoutMapIndexType): string {
        let formatted = (indexAsNumber + 1).toString();

        if (layoutMapIndexType == LayoutMapIndexType.LETTER) {
            formatted = String.fromCharCode(65 + indexAsNumber);
        }

        return formatted;
    }

    refresh() {
        this.items.forEach(value => {
            value.isEmpty = true;
            value.isSelected = false;
            value.allowSelect = true;
        });
    }

    getSelectedCoordinates(): string {
        let selectedCoordinates = '';

        let selectedMapItems = this.getSelectedLayoutMapItems();
        for (let i = 0; i < selectedMapItems.length; i++) {
            let currentItem = selectedMapItems[i];
            selectedCoordinates += (LayoutMap.getIndexFormatted(currentItem.rowIndex, this._rowIndexType) + ',' + LayoutMap.getIndexFormatted(currentItem.columnIndex, this._columnIndexType));

            if (i + 1 < selectedMapItems.length) {
                selectedCoordinates += ';';
            }
        }

        return selectedCoordinates;
    }

    getSelectedLayoutMapItems(): Array<LayoutMapItem> {
        return this.items.filter(a => a.isSelected);
    }

    getFilledMapItems() {
        let filledCoordinates = '';

        let filledMapItems = this.getFilledLayoutMapItems();
        for (let i = 0; i < filledMapItems.length; i++) {
            let currentItem = filledMapItems[i];
            filledCoordinates += (LayoutMap.getIndexFormatted(currentItem.rowIndex, this._rowIndexType) + ',' + LayoutMap.getIndexFormatted(currentItem.columnIndex, this._columnIndexType));

            if (i + 1 < filledMapItems.length) {
                filledCoordinates += ';';
            }
        }

        return filledCoordinates;
    }

    private setFilledMapItems(coordinates: string, clearItems = false) {
        if (!this.isCoordinateValid(coordinates)) {
            return;
        }

        if (clearItems) {
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].isEmpty = true;
                this.items[i].isSelected = false;
            }
        }

        coordinates = coordinates.toLowerCase();

        let coordinatesArray = coordinates.split(';');
        for (let i = 0; i < coordinatesArray.length; i++) {
            let [rowIndex, columnIndex] = LayoutMap.parsePosition(coordinatesArray[i]);

            let selectedItem = this.items.filter(a => a.columnIndex === columnIndex && a.rowIndex === rowIndex)[0];
            if (!selectedItem) {
                selectedItem = new LayoutMapItem();
                this.items.push(selectedItem);
            }
            selectedItem.isEmpty = false;
            selectedItem.columnIndex = columnIndex;
            selectedItem.rowIndex = rowIndex;
        }
    }

    private isCoordinateValid(coordinates) {
        try {
            if (coordinates === "") {
                return true;
            }
            let coordinatesArray = coordinates.split(';');

            for (let i = 0; i < coordinatesArray.length; i++) {

                let currentCoordinate = coordinatesArray[i];
                if (currentCoordinate.indexOf(',') === -1) {
                    return false;
                }

                if (currentCoordinate.split(',').length !== 2) {
                    return false;
                }
            }
        }
        catch (e) {
            return false;
        }

        return true;
    }

    getFilledLayoutMapItems(): Array<LayoutMapItem> {
        return this.items.filter(a => !a.isEmpty).sort((n1, n2) => {
            if (n1.columnIndex > n2.columnIndex) {
                return 1;
            }

            if (n1.rowIndex > n2.rowIndex) {
                return 1;
            }

            return 0;
        });
    }

    setReadOnly(value = true) {
        for (let item of this.items) {
            item.allowSelect = !value;
        }
    }

    setSelectedItem(positionStr: string) {
        let [rowIndex, columnIndex] = LayoutMap.parsePosition(positionStr);
        let position = {rowIndex, columnIndex};

        for (let item of this.items) {
            let isCurrent = position.rowIndex === item.rowIndex && position.columnIndex === item.columnIndex;
            item.isSelected = isCurrent;
            if (isCurrent) {
                item.isEmpty = true;
            }
        }
    }

    public setTooltips(tooltips: Array<TooltipData>) {
        for (let tooltip of tooltips) {
            let [rowIndex, columnIndex] = LayoutMap.parsePosition(tooltip.position);
            for (let x of this.items)
                if (x.rowIndex === rowIndex && x.columnIndex === columnIndex)
                    x.toolTipHTML = tooltip.text;
        }
    }
}

export enum LayoutMapIndexType {
    NUMBER = 0,
    LETTER = 1
}

export class TooltipData {
    constructor(public position: string, public text: string) { }
}
