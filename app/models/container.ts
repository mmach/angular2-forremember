import { IContainerType, IFreezer, ICompound } from './';

export class IContainer {
    amount: number;
    barCode: string;
    compound: ICompound;
    compoundID: number;
    containerID: number;
    containerType: IContainerType;
    containerTypeID: number;
    deadVolume: number;
    freezer: IFreezer;
    freezerID: number;
    isBroken: boolean;
    isDeleted: boolean;
    isUsedUp: boolean;
    maxCapacity: number;
    parentID: number;
    position: string;
    reason: string;
    transition: number;

    constructor(jsonObj = {}) {
        for (let key in jsonObj) {
            if (jsonObj.hasOwnProperty(key)) {
                this[key] = jsonObj[key];
            }
        }
    }

    getLocationCaption() {
        return this.freezer ? this.freezer.getCaption() : this.getTransitionCaption();
    }

    getFullLocationCaption() {
        return this.freezer ? this.freezer.getFullCaption() : this.getTransitionCaption();
    }

    getAmountCaption() {
        return this.getAmountFullCaption()
/*        if (this.amount == null) {
            return '';
        }
        return this.isUsedUp ? 'Used up' : this.amount.toFixed(1);*/
    }

    getAmountFullCaption() {
        if (this.amount == null) {
            return '';
        }
        return this.amount.toFixed(1) + (this.isUsedUp ? ' (Used up)' : '');
    }

    getTransitionCaption() {
        switch (this.transition) {
            case 1: return 'Magazine';
            case 2: return 'In Freezer';
            case 3: return 'Out of freezer';
        }
    }

}

export class AutocompleteData {
    id: any;
    name: string;
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
