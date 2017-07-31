import { Component, OnInit, Input } from "@angular/core";
import { Router, ROUTER_DIRECTIVES } from "@angular/router";
import { Observable } from "rxjs/Observable";

import { LocationsService } from "../../services/locations.service";
import { FreezersService } from "../../services/freezers.service";

import { CountryBranchView } from "../country-branch-view/country-branch-view.component";
import { Country } from "../models/Country";
import { City } from "../models/City";
import { Office } from "../models/Office";
import { LocationData } from "../models/LocationData";
import { ConfirmDialogProperties } from "../../customComponents/modalWindow/modal-window.component";
import { ModalWindowService } from "../../services/modalWindow.service";
import { CqrsService } from "../../services/cqrs.service";
import { Broadcaster, BroadcastEventType } from "../../helper/broadcast";

@Component({
    selector: "node-properties-view",
    templateUrl: "node-properties-view.component.html",
    styleUrls: ["node-properties-view.component.css"]
})

export class NodePropertiesView implements OnInit {
    @Input() locationData: any;
    @Input() nodeType: string;

    constructor(private router: Router,
        private cqrsService: CqrsService,
        private modalWindowService: ModalWindowService,
        private broadcaster: Broadcaster) {
    }

    ngOnInit() {
    }

    onEditButton() {
        if (this.nodeType == "Freezer")
            this.router.navigateByUrl("locationfreezeredit/freezer/" + this.locationData.freezerID);
        else
            this.router.navigateByUrl("locationfreezeredit/location/" + this.locationData.locationId);
    }

    onDeleteButton() {
        if (this.nodeType == "Freezer")
            this.deleteFreezer(this.locationData);
        else
            this.deleteLocation(this.locationData);
    }

    private deleteLocation(locationData) {
        var dialog = new ConfirmDialogProperties();
        dialog.onConfirmed = () => {
            var model = { id: locationData.locationId };
            this.cqrsService.execute("DeleteLocationAction", model).subscribe(
                result => {
                    if (result.Status == Status.Error)
                        console.error(result.message);
                    else if (result.Status == Status.NotEmpty)
                        this.modalWindowService.show("Warning", ["Location can't be deleted because it is not empty."]);
                    else if (result.Status == Status.Success)
                        this.broadcaster.broadcast(BroadcastEventType.TREE_CHANGED);
                },
                error => console.error(error)
            )
        }

        this.modalWindowService.show(
            "Delete location: " + locationData.name,
            ["Are you sure you want to delete location?"],
            undefined,
            dialog
        );
    }

    private deleteFreezer(locationData) {
        var dialog = new ConfirmDialogProperties();
        dialog.onConfirmed = () => {
            var model = { id: locationData.freezerID };
            this.cqrsService.execute("DeleteFreezerAction", model).subscribe(
                result => {
                    if (result.Status == Status.Error)
                        console.error(result.message);
                    else if (result.Status == Status.NotEmpty)
                        this.modalWindowService.show("Warning", ["Freezer can't be deleted because it is not empty."]);
                    else if (result.Status == Status.Success)
                        this.broadcaster.broadcast(BroadcastEventType.TREE_CHANGED);
                },
                error => console.error(error)
            )
        }

        this.modalWindowService.show(
            "Delete freezer: " + locationData.name,
            ["Are you sure you want to delete freezer?"],
            undefined,
            dialog
        );
    }
}

enum Status { Success, Error, NotEmpty }
