import { Component,forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const noop = () => {
};

export const NUMBER_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberInputComponent),
    multi: true
};

@Component({
    selector: 'number-input',
    templateUrl: 'numberInput.component.html',
    styleUrls: ['numberInput.component.css'],
    providers: [NUMBER_INPUT_CONTROL_VALUE_ACCESSOR]
})

export class NumberInputComponent {

    //The internal data model
    private innerValue: any = '';

    //Placeholders for the callbacks which are later providesd
    //by the Control Value Accessor
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    private allowedCharacters: Array<string>;

    constructor() {
         this.allowedCharacters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].concat(this.getUserDecimalMark());
    }

    //get accessor
    get value(): any {
        return this.innerValue;
    };

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

     //Set touched on blur
    onBlur() {
        this.onTouchedCallback();
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    onKeypress(event) {
        return this.allowedCharacters.indexOf(event.key) != -1;
    }

    getUserDecimalMark(): string {
        return (3/2).toLocaleString().substring(1, 2);   //returns "." or "," based on browser culture
    }

    onChange(event) {
        let value = event.srcElement.value;
        let parsed = parseFloat(value);
        if(!isNaN(parsed))
            this.value = parsed.toFixed(1);
    }
}
