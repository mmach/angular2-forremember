export class LayoutMapItem {

    columnIndex: number;
    rowIndex: number;
    itemText: string;
    toolTipHTML: string;

    isEmpty = true;
    isSelected = false;
    allowSelect = true;

    DOMStyle: any;

    filledBackgroundColor = "red";
    availableBackgroundColor = "green";
    selectedBackgroundColor = "blue";
}