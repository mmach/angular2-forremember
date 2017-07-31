import { City } from "./city";
import { Location } from "./location";
import { BroadcastEventType } from "../../helper/broadcast";

export class Country extends Location {
    cities: Array<City>;

    getNodeType(): string {
        return "Country";
    }

    children(): Array<Location> {
        return <any>this.cities;
    }

    selectEventType(): number {
        return BroadcastEventType.TREEVIEW_SELECT_COUNTRY;
    }

    addEventType(): number {
        return BroadcastEventType.TREEVIEW_ADD_CITY;
    }
}