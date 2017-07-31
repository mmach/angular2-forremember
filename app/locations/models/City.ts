import { Office } from "./office";
import { Location } from "./location";
import { BroadcastEventType } from "../../helper/broadcast";

export class City extends Location {
    offices: Array<Office>;

    getNodeType(): string {
        return "City";
    }

    children(): Array<Location> {
        return <any>this.offices;
    }

    selectEventType(): number {
        return BroadcastEventType.TREEVIEW_SELECT_CITY;
    }

    addEventType(): number {
        return BroadcastEventType.TREEVIEW_ADD_OFFICE;
    }
}
