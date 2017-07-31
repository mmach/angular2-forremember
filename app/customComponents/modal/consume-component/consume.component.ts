import { Component, OnInit  } from '@angular/core';

import { IContainer } from '../../../models/container';
import { ValidationModel } from '../../../customComponents/validation/validation-model.directive'
import { ValidatorService } from "../../../services/validator.service";

@Component({
    selector: 'consume-component',
    templateUrl: 'consume.component.html',
    styleUrls: ['consume.component.css'],
    providers: [ValidatorService]
})

export class ConsumeComponent {

    public consumedContainer: IContainer;
    public reason: string;

    private amountOriginal: number;
    private amountOriginalString: string;
    private amountTaken: number;
    private amountTakenString: string;
    private amountLeft: number;
    private amountLeftString: string;

    constructor(private validatorService: ValidatorService) { }

    public initialize(container: IContainer) {
        this.validatorService.reset();
        this.consumedContainer = container;
        this.reason = "";
        this.amountOriginal = container.amount;
        this.amountOriginalString = this.amountOriginal.toFixed(1);
        this.amountTaken = 0;
        this.amountTakenString = "0.0";
        this.update();
    }

    validate() {
        return this.validatorService.validate();
    }

    public calculateAmountLeft(): number {
        return this.amountOriginal - this.amountTaken;
    }

    private onAmountTakenChanged(event) {
        this.amountTaken = parseFloat(this.amountTakenString);
        this.update();
    }

    private update() {
        this.amountTaken = parseFloat(this.amountTakenString);
        if (isNaN(this.amountTaken)) {
            this.amountTaken = 0;
        }
        
        this.amountTakenString = this.amountTaken.toFixed(1);
        this.amountLeft = Math.max(0, this.calculateAmountLeft());
        
        this.amountLeftString = this.amountLeft.toFixed(1);
        if (this.amountLeft < this.consumedContainer.containerType.minimumAmount) {
            this.amountLeftString += ' (used up)';
        }
    }
}