import { Directive, OnInit, ElementRef, Input, ViewContainerRef } from '@angular/core';
import { ValidatorService } from "../../services/validator.service";

import { LayoutMapView } from '../../customComponents/layoutMap/layout-map-view/layout-map-view.component';
import { Autocomplete } from '../../autocomplete/autocomplete.component';
import { SequenceEditor } from '../../customComponents/sequenceEditor/sequenceEditor.component';
import { NumberInputComponent } from '../../customComponents/numberInput/numberInput.component';

@Directive({
    selector: '[validationModel]'
})
export class ValidationModel implements OnInit {

    @Input() private validationModel;
    @Input() private customValidationFunction: Function;

    private validationProperties = new ValidationProperties();

    private el: HTMLElement;
    private wrapperDiv: HTMLElement;

    private _validationResultElement: ValidationResultElement;
    get validationResultElement() {
        return this._validationResultElement;
    }
    set validationResultElement(value) {
        this._validationResultElement = value;
    }

    private get hasWarning(): boolean {
        var _WrapperDivHasWarning = false;
        if (this.wrapperDiv) {
            _WrapperDivHasWarning = this.wrapperDiv.className.indexOf("has-warning") != -1;
        }
        return _WrapperDivHasWarning;
    }
    private set hasWarning(value: boolean) {
        if (this.wrapperDiv) {
            if (value && this.wrapperDiv.className.indexOf("has-warning") == -1) {
                this.wrapperDiv.className += " has-warning";
            } else if (!value && this.wrapperDiv.className.indexOf("has-warning") != -1) {
                this.wrapperDiv.className = this.wrapperDiv.className.replace("has-warning", "");
            }
        }

        var element = (<HTMLInputElement>this.el);
        if (element) {
            if (element.tagName.toLowerCase() == "input") {
                if (value) {
                    element.style.borderColor = "#f0ad4e";
                } else {
                    element.style.borderColor = "#ccc";
                }
            } else if (element.tagName.toLowerCase() == "sequence-editor") {
                if (value) {
                    (<HTMLDivElement>element.firstChild).style.borderColor = "#f0ad4e";
                } else {
                    (<HTMLDivElement>element.firstChild).style.borderColor = "#ccc";
                }
            }
        }
    }

    private _isValid: boolean = true;
    private get isValid(): boolean {
        return this._isValid;
    }
    private set isValid(value: boolean) {
        if (!value) {
            this.highlight(true);
        } else {
            this.clearHighlight();
        }
        this._isValid = value;
    }

    private _id: string;
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }

    private get inputType(): InputType {
        var inputType = InputType.text;

        switch (this.el.getAttribute("type")) {
            case "number":
                {
                    inputType = InputType.number;
                    break;
                }
        }

        return inputType;
    }

    get value(): any {
        var element = (<HTMLInputElement>this.el);
        var value: any;

        if (element.tagName.toLowerCase() == "layout-map-view") {
            let layoutMapView = <LayoutMapView>(<any>this._view)._element.component;
            if (layoutMapView) {
                value = layoutMapView.layoutMap.getSelectedCoordinates();
            }
        }
        else if (element.tagName.toLowerCase() == "autocomplete") {
            let autocomplete = <Autocomplete>(<any>this._view)._element.component;
            if (autocomplete) {
                value = autocomplete.query;
            }
        }
        else if (element.tagName.toLowerCase() == "sequence-editor") {
            let sequenceEditor = <SequenceEditor>(<any>this._view)._element.component;
            if (sequenceEditor) {
                value = sequenceEditor.value;
            }
        }
        else if (element.tagName.toLowerCase() == "number-input") {
            let numberInput = <NumberInputComponent>(<any>this._view)._element.component;
            if (numberInput) {
                value = numberInput.value;
            }
        }
        else {
            if (element.getAttribute("type") == "checkbox") {
                value = element.checked;
            } else {
                value = element.value;
            }
        }

        return value;
    }

    get minFromAttr(): number {
        return ValidationModel.getAsNumber(this.el.getAttribute('min'));
    }

    get maxFromAttr(): number {
        return ValidationModel.getAsNumber(this.el.getAttribute('max'));
    }

    constructor(el: ElementRef,
        private _view: ViewContainerRef) {
        this.el = el.nativeElement;
    }

    private getValidatorService(): ValidatorService {
        //ValidationModal directive cannot be used WITHOUT ValidatorService!!
        var parentView = (<any>this._view)._element.parentView;

        var foundedValidatorService = this.getValidatorServiceFromContext(parentView.context);
        while (!foundedValidatorService) {
            parentView = parentView.parentInjector._view;
            foundedValidatorService = this.getValidatorServiceFromContext(parentView.context);
        }

        return foundedValidatorService;
    }

    private getValidatorServiceFromContext(context) {
        var validatorService;
        for (var prop in context) {
            if (context.hasOwnProperty(prop) && context[prop] && context[prop] instanceof ValidatorService) {
                validatorService = context[prop];
            }
        }
        return validatorService;
    }

    ngOnInit() {
        this.getValidationProperties();
        if (!this.id) {
            return;
        }

        this.getValidatorService().addValidationModel(this._id, this);

        this.wrapperDiv = this.el.parentElement;
        while (this.wrapperDiv.nodeName.toLowerCase() != "div") {
            this.wrapperDiv = this.wrapperDiv.parentElement;
        }

        var warningDiv = document.createElement("div");
        this.validationResultElement = new ValidationResultElement(warningDiv);

        warningDiv.className = "form-control-label";
        warningDiv.style.display = "none";
        warningDiv.style.padding = "0";
        if (this.el.style.cssFloat == "right") {
            warningDiv.style.cssFloat = "right";
        }
        if (this.validationProperties.resultDivWidth) {
            warningDiv.style.width = this.validationProperties.resultDivWidth;
        }

        var warningI = document.createElement("i");
        warningI.className = "material-icons warning-icon";
        warningI.style.cssFloat = "left";
        warningI.innerHTML = "warning";
        warningDiv.appendChild(warningI);
        warningDiv.innerHTML += this.validationProperties.baseResultText;

        this.validationResultElement.setResultDiv(warningDiv);

        this.wrapperDiv.insertBefore(this.validationResultElement.element, this.wrapperDiv.lastChild);
    }

    public getHTMLElement(): HTMLElement {
        return this.el;
    }

    private showResult() {
        if (this.validationResultElement.resultText) {
            this.validationResultElement.element.style.display = "";
        }
    }

    hideResult() {
        this.validationResultElement.element.style.display = "none";
    }

    validate(): boolean {
        this.validationResultElement.resultText = "";
        this.isValid = true;

        this.getValidationProperties();

        //Required
        if (this.validationProperties.required && (!this.value || this.value == "")) {
            if (this.validationProperties.requiredResultText) {
                this.validationResultElement.resultText = this.validationProperties.requiredResultText;
            }
            if (!this.validationResultElement.resultText && this.validationProperties.baseResultText) {
                this.validationResultElement.resultText = this.validationProperties.baseResultText;
            }
            if (!this.validationResultElement.resultText) {
                this.validationResultElement.resultText = "Field is required.";
            }
            this.isValid = false;
        }

        //NumberRange
        if (this.isValid && this.validationProperties.doCheckRange) {
            var currentValue = this.value;
            if (currentValue < this.validationProperties.min || currentValue > this.validationProperties.max) {
                if (this.validationProperties.rangeResultText) {
                    this.validationResultElement.resultText = this.validationProperties.rangeResultText;
                }
                if (!this.validationResultElement.resultText && this.validationProperties.baseResultText) {
                    this.validationResultElement.resultText = this.validationProperties.baseResultText;
                }
                if (!this.validationResultElement.resultText) {
                    this.validationResultElement.resultText = "Please select number between " + this.validationProperties.min + " and " + this.validationProperties.max;
                }
                this.isValid = false;
            }
        }

        //Length
        if (this.isValid && this.value) {
            var currentValueLength = this.value.toString().length;
            if (currentValueLength < this.validationProperties.minLength || currentValueLength > this.validationProperties.maxLength) {
                if (this.validationProperties.lengthResultText) {
                    this.validationResultElement.resultText = this.validationProperties.lengthResultText;
                }
                if (!this.validationResultElement.resultText && this.validationProperties.baseResultText) {
                    this.validationResultElement.resultText = this.validationProperties.baseResultText;
                }
                if (!this.validationResultElement.resultText) {
                    if (this.validationProperties.minLength === this.validationProperties.maxLength) {
                        this.validationResultElement.resultText = "Field value length must be " + this.validationProperties.minLength + " characters.";
                    } else {
                        this.validationResultElement.resultText = "Field value length must be between " + this.validationProperties.minLength + " and " + this.validationProperties.maxLength;
                    }
                }
                this.isValid = false;
            }
        }

        //CustomValidation
        if (this.isValid && this.customValidationFunction) {
            var parentComponent = this.getParentComponent();
            if (!this.customValidationFunction.call(parentComponent, this)) {
                if (this.validationProperties.customValidationResultText) {
                    this.validationResultElement.resultText = this.validationProperties.customValidationResultText;
                }
                if (!this.validationResultElement.resultText && this.validationProperties.baseResultText) {
                    this.validationResultElement.resultText = this.validationProperties.baseResultText;
                }
                if (!this.validationResultElement.resultText) {
                    this.validationResultElement.resultText = "Validation failed.";
                }
                this.isValid = false;
            }
        }

        //Visibility of ResultText div.
        if (this.validationResultElement.resultText != "") {
            this.validationResultElement.visible = this.validationProperties.resultVisible;
            if (!this.validationResultElement.visible) {
                this.hasWarning = false;
            }
        }

        return this.isValid;
    }

    getParentComponent() {
        var parentComponentView = (<any>this._view).parentInjector._view;
        while (parentComponentView.context.constructor.name == "Object") {
            parentComponentView = parentComponentView.parentInjector._view;
        }
        return parentComponentView.context;
    }

    getValid() {
        return this.isValid;
    }

    //Set valid function manually.
    setValid(value: boolean, text?: string) {
        if (text) {
            this.validationResultElement.resultText = text;
        }
        this.isValid = value;
    }

    private highlight(showResult: boolean) {
        this.hasWarning = true;
        if (showResult) {
            this.showResult();
        }
    }

    private clearHighlight() {
        this.hasWarning = false;
        this.hideResult();
    }

    private getValidationProperties() {
        if (this.validationModel) {
            try {
                var validationJSON = JSON.parse(this.validationModel);

                //id
                this.id = validationJSON.id;

                //resultVisible
                if (validationJSON.resultVisible) { this.validationProperties.resultVisible = validationJSON.resultVisible === true || validationJSON.resultVisible === "true"; }

                //resultDiv
                if (validationJSON.resultDivWidth) { this.validationProperties.resultDivWidth = validationJSON.resultDivWidth; }

                //baseResultText
                if (validationJSON.baseResultText) { this.validationProperties.baseResultText = validationJSON.baseResultText; }

                //required
                this.validationProperties.required = validationJSON.required && validationJSON.required;
                if (validationJSON.requiredResultText) { this.validationProperties.requiredResultText = validationJSON.requiredResultText; }

                //range
                if (validationJSON.min) {
                    this.validationProperties.min = ValidationModel.getAsNumber(validationJSON.min);
                    this.validationProperties.doCheckRange = true;
                }
                else if (this.el.hasAttribute("min")) {
                    this.validationProperties.min = ValidationModel.getAsNumber(this.el.getAttribute("min"));
                    this.validationProperties.doCheckRange = true;
                }
                if (validationJSON.max) {
                    this.validationProperties.max = ValidationModel.getAsNumber(validationJSON.max);
                    this.validationProperties.doCheckRange = true;
                }
                else if (this.el.hasAttribute("max")) {
                    this.validationProperties.max = ValidationModel.getAsNumber(this.el.getAttribute("max"));
                    this.validationProperties.doCheckRange = true;
                }
                if (validationJSON.rangeResultText) { this.validationProperties.rangeResultText = validationJSON.rangeResultText; }

                //length
                if (validationJSON.minLength) {
                    this.validationProperties.minLength = ValidationModel.getAsNumber(validationJSON.minLength);
                }
                if (validationJSON.maxLength) {
                    this.validationProperties.maxLength = ValidationModel.getAsNumber(validationJSON.maxLength);
                }
                if (validationJSON.lengthResultText) { this.validationProperties.lengthResultText = validationJSON.lengthResultText; }

                //customValidation
                if (validationJSON.customValidationResultText) { this.validationProperties.customValidationResultText = validationJSON.customValidationResultText; }
            }
            catch (e) {
                console.log(e);
            }
        }
    }

    public static getAsNumber(val: any) {

        var isInt = function (x) {
            return !isNaN(x) && eval(x).toString().length == parseInt(eval(x)).toString().length;
        };

        var isFloat = function (x) {
            return !isNaN(x) && !isInt(eval(x)) && x.toString().length > 0
        };

        var res = 0;

        if (typeof (val) == "number") {
            res = val;
        }
        else if (isFloat(val)) {
            res = parseFloat(val);
        }
        else if (isInt(val)) {
            res = parseInt(val);
        }

        return res;
    }
}

export class ValidationProperties {
    baseResultText = "";

    required = false;
    requiredResultText = ""

    doCheckRange: boolean = false;
    minDefaultValue = -9999999999;
    maxDefaultValue = 9999999999;
    min = this.minDefaultValue;
    max = this.maxDefaultValue;
    rangeResultText = ""

    minLengthDefaultValue = 0;
    maxLengthDefaultValue = 9999999999;
    minLength = this.minLengthDefaultValue;
    maxLength = this.maxLengthDefaultValue;
    lengthResultText = "";

    customValidationResultText = "";

    resultDivWidth = "";
    resultVisible = true;
}

export class ValidationResultElement {
    private _element: HTMLElement;
    get element() {
        return this._element;
    }
    set element(value) {
        this._element = value;
    }

    private _resultDiv: HTMLElement;

    get resultText() {
        return this._resultDiv.innerHTML.substring(this._resultDiv.innerHTML.indexOf('</i>') + 4);
    }
    set resultText(value) {
        this._resultDiv.innerHTML = this._resultDiv.innerHTML.substring(0, this._resultDiv.innerHTML.indexOf('</i>') + 4) + value;
    }

    get visible() {
        return this._resultDiv.style.display == "";
    }
    set visible(value) {
        this._resultDiv.style.display = value ? "" : "none";
    }

    setResultDiv(resultDiv) {
        this._resultDiv = resultDiv;
    }

    constructor(el: HTMLElement) {
        this.element = el;
    }
}

export enum InputType {
    text,
    number
}