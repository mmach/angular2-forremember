import { Component, Input, OnInit } from "@angular/core";
import { Broadcaster, BroadcastEventType} from "../../helper/broadcast";
import { BaseBranchView } from "../base-branch-view/base-branch-view.component";
import { CityBranchView } from "../city-branch-view/city-branch-view.component";
import { Country } from "../models/Country";
import { LocationsTreeStateService } from "../../services/Locations-Tree-State.Service";

@Component({
    selector: "[country-branch-view]",
    templateUrl: "country-branch-view.component.html",
    styleUrls: ["../base-branch-view/base-branch-view.component.scss"]
})

export class CountryBranchView extends BaseBranchView implements OnInit {
    @Input() country: Country;

    constructor(broadcaster: Broadcaster) {
        super(broadcaster);
    }

    location() {
        return this.country;
    }
}
