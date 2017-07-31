import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Broadcaster, BroadcastEventType } from '../../helper/broadcast';
import { TreeView } from '../tree-view/tree-view.component';
import { NodePropertiesView } from '../node-properties-view/node-properties-view.component';
import { LocationData } from '../models/LocationData';

import { LocationsTreeStateService } from '../../services/Locations-Tree-State.Service';


import { LocationsService } from '../../services/locations.service';
import { FreezersService } from '../../services/freezers.service';


import { Location } from '../models/location';
import { Country } from '../models/Country';
import { City } from '../models/City';
import { Office } from '../models/Office';
import { IFreezer } from '../../models/freezer';
import { Preloader } from '../../customComponents';

@Component({
    templateUrl: 'locations-browse.component.html'
})
export class LocationsBrowseComponent implements OnInit {
    nodeType: string;
    locationData: LocationData;
    @Input() countries: Array<Country>;

    @ViewChild(Preloader)
    private preloader: Preloader;

    constructor(
        private router: Router,
        private broadcaster: Broadcaster,
        private locationsService: LocationsService,
        private freezersService: FreezersService
    ) {

        this.broadcaster.on<any>(BroadcastEventType.TREEVIEW_SELECT_COUNTRY)
            .subscribe(event => this.selectNode('Country', event));

        this.broadcaster.on<any>(BroadcastEventType.TREEVIEW_SELECT_CITY)
            .subscribe(event => this.selectNode('City', event));

        this.broadcaster.on<any>(BroadcastEventType.TREEVIEW_SELECT_OFFICE)
            .subscribe(event => this.selectNode('Office', event));

        this.broadcaster.on<any>(BroadcastEventType.TREEVIEW_SELECT_FREEZER)
            .subscribe(event => this.selectNode('Freezer', event));

        //
        this.broadcaster.on<any>(BroadcastEventType.TREEVIEW_ADD_COUNTRY)
            .subscribe(event => {
                /*not implemented*/
            });

        this.broadcaster.on<any>(BroadcastEventType.TREEVIEW_ADD_CITY)
            .subscribe(event => {
                this.router.navigateByUrl('/locationfreezeradd/location/' + event)
            });

        this.broadcaster.on<any>(BroadcastEventType.TREEVIEW_ADD_OFFICE)
            .subscribe(event => {
                this.router.navigateByUrl('/locationfreezeradd/location/' + event)
            });

        this.broadcaster.on<any>(BroadcastEventType.TREEVIEW_ADD_FREEZER)
            .subscribe(event => {
                this.router.navigateByUrl('/locationfreezeradd/freezer/' + event)
            });

        this.broadcaster.on<any>(BroadcastEventType.TREE_CHANGED)
            .subscribe(event => {
                this.updateTreeView();
                this.selectNode(null, null);
            });
    }

    selectNode(type: string, data) {
        this.nodeType = type;
        this.locationData = data;
    }

    ngOnInit() {
        this.updateTreeView();
    }

    checkSetCurrentLocation(location: Location) {
        if (LocationsTreeStateService.isCurrentNode(location.locationId)) {
            this.selectNode(location.getNodeType(), location);
        }
    }

    updateTreeView() {
        this.preloader.show(null, 500);
        Observable.forkJoin(
            this.locationsService.getAllLocations(),
            this.freezersService.getFreezers())
            .subscribe(
                data => {
                    this.countries = this.buildTreeFromLocationsList(data[0], data[1]);
                    this.preloader.hide();
                },
                error => {
                    this.preloader.hide();
                    console.error(error);
                }
        );
    }

    buildTreeFromLocationsList(locations, freezers): Array<Country> {
        return locations
            .filter(location => !location.parentLocationId)
            .map(location => {
                let country = new Country();
                country.locationId = location.id;
                country.name = location.name;
                country.cities = this.buildCitiesForCountry(locations, freezers, country);
                this.checkSetCurrentLocation(country);

                return country;
            });
    }

    buildCitiesForCountry(locations, freezers, country: Country): Array<City> {
        return locations
            .filter(location => location.parentLocationId === country.locationId)
            .map(location => {
                let city = new City();
                city.locationId = location.id;
                city.name = location.name;
                city.parent = country;
                city.offices = this.buildOfficesForCity(locations, freezers, city);
                this.checkSetCurrentLocation(city);

                return city;
            });
    }

    buildOfficesForCity(locations, freezers, city: City) {
        return locations
            .filter(location => location.parentLocationId === city.locationId)
            .map(location => {
                let office = new Office();
                office.locationId = location.id;
                office.name = location.name;
                office.address = location.address;
                office.parent = city;
                office.freezers = this.buildFreezersForOffice(freezers, office);
                this.checkSetCurrentLocation(office);

                return office;
            });
    }

    buildFreezersForOffice(freezers, office: Office): Array<IFreezer> {
        return freezers
            .filter(freezer => freezer.locationID === office.locationId)
            .map(freezer => {
                let f = new IFreezer();
                Object.assign(f, freezer);
                f.location = new Office();
                Object.assign(f.location, office);
                if (LocationsTreeStateService.isCurrentFreezer(f.freezerID)) {
                    this.selectNode('Freezer', f);
                }
                return f;
            });
    }

    // ngOnDestroy() {
    //     /* unsubscribe from broadcaster?*/
    // }
}
