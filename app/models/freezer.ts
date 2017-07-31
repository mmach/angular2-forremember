export class IFreezer {
    freezerID: number;
    locationID: number;
    name: string;
    temperature: number;
    capacity: number;
    olc: number;
    location: any;
    userId: number;
    usedSpace: number;
    fullPath: string;
    ErrorCode: number;
    constructor(jsonObj = {}) {
        for (let key in jsonObj) {
            if (jsonObj.hasOwnProperty(key)) {
                this[key] = jsonObj[key];
            }
        }
    }

    getCaption() {
        return this.location != null ? `${this.location.name} / ${this.name}` : this.name;
    }

    getFullCaption() {
        return this.location != null ? `${this.location.fullPath} / ${this.name}` : this.name;
    }
}
