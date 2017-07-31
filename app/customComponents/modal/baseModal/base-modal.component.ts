import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ModalConfig } from './modal-config';

@Component({
    selector: 'base-modal',
    templateUrl: 'base-modal.component.html'
})
export class BaseModal {

    @Input() modalToShow: string;
    @Input() width: string;
    @Output() onConfirmEvent = new EventEmitter<void>();

    public title: string;
    config: ModalConfig = {
        yesButton: true,
        yesButtonCaption: 'Yes',
        cancelButton: true,
        cancelButtonCaption: 'Cancel'
    };

    emitConfirmEvent() {
        this.onConfirmEvent.emit(null);
    }

    private modalID: string;
    jQuery: any = $;

    private $modalObject: any;

    constructor() {
        this.modalID = this.generateModalID();
    }

    private generateModalID() {
        let generatedModalIDs = (<any>window).GeneratedModalIDs || [];

        // Check is generated id used before.
        let generatedID = 'ModalID' + Math.floor((Math.random() * 1000) + 1);
        while (generatedModalIDs.filter((value) => { return value == generatedID; })[0]) {
            generatedID = 'ModalID' + Math.floor((Math.random() * 1000) + 1);
        }
        generatedModalIDs.push(generatedID);

        return generatedID;
    }

    show(title: string, config: ModalConfig = null) {
        this.config = Object.assign(this.config, config);
        this.$modalObject = this.jQuery('#' + this.modalID).modal('show');

        this.title = title;
        let $ = this.jQuery;

        this.$modalObject.on('hidden.bs.modal', function () {
            ($(this)).off('hidden.bs.modal');
        });
    }

    onConfirmClick() {
        this.emitConfirmEvent();
    }

    public hide() {
        this.$modalObject.modal('hide');
    }

    onCancelClick() { }
}

