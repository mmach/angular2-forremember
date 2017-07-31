import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LayoutMapItem } from '../models/LayoutMapItem';

@Component({
    selector: 'layout-mapitem-view',
    templateUrl: 'layout-mapitem-view.component.html',
    styleUrls: ['layout-mapitem-view.component.css']
})

export class LayoutMapItemView implements OnInit {
    @Input() layoutMapItem: LayoutMapItem;
    @Output() cellChange = new EventEmitter();
    @Output() cellSelected = new EventEmitter();
    @Output() cellUnSelected = new EventEmitter();
    @Output() cellMouseLeave = new EventEmitter();

    wrapperDOMSyle: any;

    currentPositionHTML: string;

    constructor() {
    }

    ngOnInit() {
        this.wrapperDOMSyle = {
            "cursor": "cell"
        };

        this.layoutMapItem.DOMStyle = {
            "background-color": this.layoutMapItem.isEmpty ? (this.layoutMapItem.isSelected ? this.layoutMapItem.selectedBackgroundColor : "") : this.layoutMapItem.filledBackgroundColor
        };
    }

    highlight(enable: boolean) {
        if (!this.layoutMapItem.isEmpty || this.layoutMapItem.isSelected || !this.layoutMapItem.allowSelect) {
            return;
        }
        
        //Fire CellChange Event
        this.cellChange.next(this.layoutMapItem);

        if (enable) {
            this.layoutMapItem.DOMStyle["background-color"] = this.layoutMapItem.availableBackgroundColor;
        } else {

            //Fire CellMouseLeave Event
            this.cellMouseLeave.next(this.layoutMapItem);

            this.layoutMapItem.DOMStyle["background-color"] = "";
        }
    }

    onMapItemClick() {
        if (!this.layoutMapItem.isEmpty || !this.layoutMapItem.allowSelect) {
            return;
        }

        if (this.layoutMapItem.isSelected) {
            this.layoutMapItem.isSelected = false;
            this.layoutMapItem.DOMStyle["background-color"] = "";

            //Fire CellUnSelected Event
            this.cellUnSelected.next(this.layoutMapItem);
        }
        else {
            this.layoutMapItem.isSelected = true;
            this.layoutMapItem.DOMStyle["background-color"] = this.layoutMapItem.selectedBackgroundColor;

            //Fire CellSelected Event
            this.cellSelected.next(this.layoutMapItem);
        }
    }
}
