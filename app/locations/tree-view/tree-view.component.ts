import { Component, OnInit, Input, EventEmitter } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { CountryBranchView } from "../country-branch-view/country-branch-view.component";
import { Country } from "../models/Country";

@Component({
    selector: "tree-view",
    templateUrl: "tree-view.component.html",
    styleUrls: ["tree-view.component.css"]
})

export class TreeView implements OnInit {
    @Input() countries: Array<Country>;

    constructor() {
    }

    ngOnInit() {
    }
}
