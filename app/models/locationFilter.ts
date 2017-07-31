import { IFreezer } from './';

export class LocationFilter {
    freezer: IFreezer;

    static fromFreezer(freezer: IFreezer): LocationFilter {
        let item = new LocationFilter('freezer');
        item.freezer = freezer;
        return item;
    }

    constructor(public type = '', public name = '', public transitionID: number = null) {
    }

    getFreezerID() {
        return this.freezer && this.freezer.freezerID;
    }

    getTransitionID() {
        return this.transitionID;
    }

    getName() {
        return this.name || this.freezer && this.freezer.fullPath;
    }
}
