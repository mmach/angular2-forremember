import { Injectable } from '@angular/core';
import { ValidationModel } from '../customComponents/validation/validation-model.directive';

import { Broadcaster } from '../helper/broadcast';

@Injectable()
export class ValidatorService {

    private broadcaster: Broadcaster;
    private _validationModelArray = new Array<ValidationModel>();

    constructor() {
        this.broadcaster = (<any>window).GlobalBroadcaster;
    }

    addValidationModel(id: string, validationModel: ValidationModel) {

        let foundedValidationModel: ValidationModel;
        let foundedValidationModelIndex: number;
        this._validationModelArray.forEach((value: ValidationModel, index: number) => {
            if (value.id == id) {
                foundedValidationModel = value;
                foundedValidationModelIndex = index;
            }
        });

        if (!foundedValidationModel) {
            this._validationModelArray.push(validationModel);
        } else {
            this._validationModelArray[foundedValidationModelIndex] = validationModel;
        }
    }

    getValidationModel(id: string) {
        return this._validationModelArray.filter((value, index, array) => { return value.id == id; })[0];
    }

    validate(): boolean {
        this.clearGlobalMessage();

        let isAllValid = true;
        for (let i = 0; i < this._validationModelArray.length; i++) {
            let currentValidationModel = this._validationModelArray[i];
            let el = currentValidationModel.getHTMLElement();
            if (document.body.contains(el) ) {
                let isValid = currentValidationModel.validate();
                if (!isValid) {
                    isAllValid = false;
                }
            }
        }
        return isAllValid;
    }

    reset() {
        for (let i = 0; i < this._validationModelArray.length; i++) {
            this._validationModelArray[i].setValid(true);
        }
    }

    setGlobalErrorMessage(message: string) {
        this.broadcaster.broadcast('errorMsg', message);
    }

    setGlobalInfoMessage(message: string) {
        this.broadcaster.broadcast('infoMsg', message);
    }

    setGlobalSuccessMessage(message: string) {
        this.broadcaster.broadcast('successMsg', message);
    }

    clearGlobalMessage() {
        this.broadcaster.broadcast('clearMsg');
    }
}
