import { Component } from '@angular/core';

@Component({
    selector: 'modal-window',
    templateUrl: 'modal-window.component.html',
    styleUrls: ['modal-window.component.scss']
})
export class ModalWindowComponent {
    onClosed: any;

    private _isConfirmDialog = false;
    get isConfirmDialog() {
        return this._isConfirmDialog;
    }
    set isConfirmDialog(value) {
        this._isConfirmDialog = value;
    }

    private _confirmDialogProperties = new ConfirmDialogProperties();
    get confirmDialogProperties() {
        return this._confirmDialogProperties;
    }
    set confirmDialogProperties(value) {
        this._confirmDialogProperties = value;
    }

    smallText: boolean;

    noReason = false;

    title: string;
    texts: Array<string>;
    private modalID: string;
    jQuery: any = $;

    private $modalObject: any;

    constructor() {
        this.modalID = this.generateModalID();
    }

    show(title: string, texts: Array<string>, options = { smallText: false }, confirmDialogProperties?: ConfirmDialogProperties) {
        this.noReason = false;
        if (confirmDialogProperties && confirmDialogProperties.ResetValues) {
            this.isConfirmDialog = true;
            this.confirmDialogProperties = confirmDialogProperties;
        }

        this.title = title;
        this.texts = texts;
        this.smallText = options.smallText;
        this.$modalObject = this.jQuery("#" + this.modalID).modal("show");
        let $modalContent = this.$modalObject.first();
        $modalContent.css({
            "top": "0px",
            "left": "0px"
        });
        if(!$modalContent.data('uiDraggable')){
            $modalContent.draggable({
                        handle: ".modal-header"
            });
        }        

        var onClosedRef = this.onClosed;
        var confirmDialogPropertiesRef = this.confirmDialogProperties;
        this.$modalObject.on('hidden.bs.modal', function () {
            (<any>$(this)).off('hidden.bs.modal');
            confirmDialogPropertiesRef.ResetValues();

            //Do not fire close event if confirmation accepted.
            if (!(<any>confirmDialogPropertiesRef)._confirmClicked && onClosedRef) {
                onClosedRef();
            }

            //Set confirmClicked flag back to false for regular modal closing.
            (<any>confirmDialogPropertiesRef)._confirmClicked = false;
        });
    }

    hide() {

    }

    onReasonChange() { this.noReason = false; }

    private generateModalID() {
        var generatedModalIDs = (<any>window).GeneratedModalIDs;
        if (!generatedModalIDs) {
            generatedModalIDs = [];
        }

        //Check is generated id used before.
        var generatedID = 'ModalID' + Math.floor((Math.random() * 1000) + 1);
        while (generatedModalIDs.filter((value) => { return value == generatedID })[0]) {
            generatedID = 'ModalID' + Math.floor((Math.random() * 1000) + 1);
        }
        generatedModalIDs.push(generatedID);

        return generatedID;
    }

    private onConfirmClick() {
        var isValidToFire = true;
        if (this.confirmDialogProperties.isReasonMandatory && this.confirmDialogProperties.reasonText.length == 0) {
            isValidToFire = false;
            this.noReason = true;
        }

        if (isValidToFire) {
            var rt = this.confirmDialogProperties.reasonText;
            this.noReason = false;
            //Close modal after confirmation.
            this.$modalObject.modal('hide');

            var thisRef = this;
            this.$modalObject.on('hidden.bs.modal', function () {
                //Set confirmClicked flag to true to realize confirm button is clicked from modal.
                (<any>thisRef).confirmDialogProperties._confirmClicked = true;
                if (thisRef.confirmDialogProperties.onConfirmed) {

                    thisRef.confirmDialogProperties.reasonText = rt;
                    thisRef.confirmDialogProperties.onConfirmed();
                }
            });

        } else {

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
