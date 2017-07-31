import { IFreezer } from "../../models/Freezer";
import { Location } from "./location";
import { BroadcastEventType } from "../../helper/broadcast";

export class Office extends Location {
    address: string;
    freezers: Array<IFreezer>;

    getNodeType(): string {
        return "Office";
    }

    children(): Array<Location> {
        return <any>this.freezers;
    }

    selectEventType(): number {
        return BroadcastEventType.TREEVIEW_SELECT_OFFICE;
    }

    addEventType(): number {
        return BroadcastEventType.TREEVIEW_ADD_FREEZER;
    }
}