import { Input, OnInit } from "@angular/core";

import { LocationsTreeStateService } from "../../services/Locations-Tree-State.Service";
import { Location } from "../models/location";
import { Broadcaster } from "../../helper/broadcast";

export abstract class BaseBranchView implements OnInit {
    @Input() isAddLocationIconVisible: boolean;
    @Input() isExpanded: boolean;

    constructor(protected broadcaster: Broadcaster) {
        this.isAddLocationIconVisible = false;
    }

    toggleExpanded() {
        this.isExpanded = !this.isExpanded;

        LocationsTreeStateService.setSelectedPath(this.location().getPath(), this.location().getNodeType(), this.location(), this.isExpanded);
    }

    ngOnInit() {
        this.isExpanded = LocationsTreeStateService.isNodeExpanded(this.location().locationId);
    }

    isCurrentPath() {
        return LocationsTreeStateService.isCurrentPath(this.location().locationId);
    }

    onBranchHeaderClick() {
        this.toggleExpanded();
        this.broadcaster.broadcast(this.location().selectEventType(), this.location());
    }

    onAddLocationIconClick() {                     
        this.broadcaster.broadcast(this.location().addEventType(), this.location().locationId);
    }

    isEmpty() {
        return !this.location().children().length;
    }

    abstract location(): Location;
}
