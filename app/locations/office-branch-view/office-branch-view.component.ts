import { Component, Input, OnInit } from "@angular/core";
import { Broadcaster, BroadcastEventType } from "../../helper/broadcast";
import { BaseBranchView } from "../base-branch-view/base-branch-view.component";
import { Office } from "../models/Office";
import { IFreezer } from "../../models/Freezer";
import { LocationsTreeStateService } from "../../services/Locations-Tree-State.Service";

@Component({
    selector: "[office-branch-view]",
    templateUrl: "office-branch-view.component.html",
    styleUrls: ["../base-branch-view/base-branch-view.component.scss"]
})

export class OfficeBranchView extends BaseBranchView {
    @Input() office: Office;

    constructor(broadcaster: Broadcaster) {
        super(broadcaster);
    }

    onBranchLeafClick(freezer: IFreezer) {
        LocationsTreeStateService.setFreezerSelectedPath(freezer.location.getPath(), "Freezer", freezer, freezer.freezerID);
        this.broadcaster.broadcast(BroadcastEventType.TREEVIEW_SELECT_FREEZER, freezer);
    }

    isCurrentPathFreezer(freezerID): boolean {
        return LocationsTreeStateService.isCurrentFreezer(freezerID);
    }

    location() {
        return this.office;
    }
}
