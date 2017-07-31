import { Injectable } from '@angular/core';
import { ModalWindowComponent, ConfirmDialogProperties } from "../customComponents/modalWindow/modal-window.component";

@Injectable()
export class ModalWindowService {
    
    private modalWindow: ModalWindowComponent;
    
    get isConfirmDialog() {
        return this.modalWindow.isConfirmDialog;
    }
    set isConfirmDialog(value) {
        this.modalWindow.isConfirmDialog = value;
    }

    constructor() {
        
    }

    initialize(modalWindow: ModalWindowComponent) {
        this.modalWindow = modalWindow;
    }

    show(title: string, texts: Array<string>, options = { smallText: false }, confirmDialogProperties?: ConfirmDialogProperties) {
        if (!confirmDialogProperties) {
            this.isConfirmDialog = false;
        }
        this.modalWindow.show(title, texts, options, confirmDialogProperties);
    }
}
