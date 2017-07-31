import { Component, Input } from '@angular/core';
import { BaseModal } from '../baseModal/base-modal.component';

@Component({
    selector: 'modal-window',
    templateUrl: 'modal-window.component.html'
})

export class ModalWindowComponent extends BaseModal {
    onClosed: any;

    confirmDialogProperties: ConfirmDialogProperties;

    isConfirmDialog: boolean;

    noReason: boolean;

    constructor() {
        super();
    }

    text: string;

    initialise() {
        this.noReason = false;
        console.log(this.confirmDialogProperties);
        if (this.confirmDialogProperties && this.confirmDialogProperties.ResetValues) {
            this.isConfirmDialog = true;            
        }                                       
    }

    onConfirmClick() {
        var isValidToFire = true;
        if (this.confirmDialogProperties.isReasonMandatory && this.confirmDialogProperties.reasonText.length == 0) {
            isValidToFire = false;
            this.noReason = true;
        }  

       
    }

    private reasonPlaceholder() {
        return this.confirmDialogProperties.showPredefinedReasons ? 'Please choose the reason from the list or provide yours' : 'Please provide the reason';
    }
}

export class ConfirmDialogProperties {
    onConfirmed: any;

    private _confirmClicked: boolean = false;

    private _predefinedReasonList: Array<string>;
    get predefinedReasonList() {
        return this._predefinedReasonList;
    }
    set predefinedReasonList(value) {
        this._predefinedReasonList = value;
    }

    private _showPredefinedReasons: boolean;
    get showPredefinedReasons() {
        return this._showPredefinedReasons;
    }
    set showPredefinedReasons(value) {
        this._showPredefinedReasons = value;
    }

    private _showReasonArea: boolean;
    get showReasonArea() {
        return this._showReasonArea;
    }
    set showReasonArea(value) {
        this._showReasonArea = value;
    }

    private _isReasonMandatory: boolean;
    get isReasonMandatory() {
        return this._isReasonMandatory;
    }
    set isReasonMandatory(value) {
        this._isReasonMandatory = value;
    }

    private _reasonText: string;
    get reasonText() {
        return this._reasonText;
    }
    set reasonText(value) {
        this._reasonText = value;
    }

    private _isPredefinedReasonTextReadonly = false;
    private _selectedPredefinedReasonText = '';
    private get selectedPredefinedReasonText() {
        return this._selectedPredefinedReasonText;
    }
    private set selectedPredefinedReasonText(value) {


        if (value && value == "another reason") {
            this._reasonText = "";
            this._isPredefinedReasonTextReadonly = false;
            return;
        }

        //if (value && value == "") {
        //      this._reasonText = "";
        //      this._isPredefinedReasonTextReadonly = false;
        //}

        if (value && value != "") {
            this._reasonText = value.trim();
            this._isPredefinedReasonTextReadonly = true;
        } else {
            this._reasonText = "";
            this._isPredefinedReasonTextReadonly = false;
        }
        this._selectedPredefinedReasonText = value;

    }

    constructor() {
        this.ResetValues();
    }

    ResetValues() {
        this._predefinedReasonList = [
            "Broken",
            "Not Used",
            "Unavailable",
        ];

        this._showPredefinedReasons = false;
        this._showReasonArea = false;
        this._isReasonMandatory = false;
        this._reasonText = "";
        this._isPredefinedReasonTextReadonly = false;
        this._selectedPredefinedReasonText = "another reason";

    }
}