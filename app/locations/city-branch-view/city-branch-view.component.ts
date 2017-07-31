import { Component, Input, OnInit } from '@angular/core';
import { Broadcaster } from '../../helper/broadcast';
import { BaseBranchView } from '../base-branch-view/base-branch-view.component';

import { City } from '../models/City';
import { LocationsTreeStateService } from '../../services/Locations-Tree-State.Service';


@Component({
  selector: '[city-branch-view]',
  templateUrl: 'city-branch-view.component.html',
  styleUrls: ['../base-branch-view/base-branch-view.component.scss'],
})

export class CityBranchView extends BaseBranchView implements OnInit {
    @Input() city: City;

    constructor(broadcaster: Broadcaster) {
        super(broadcaster);
    }

    location() {
        return this.city;
    }
}
