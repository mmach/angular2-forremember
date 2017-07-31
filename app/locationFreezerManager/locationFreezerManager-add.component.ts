import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

import { ILocation } from "../models/location";
import { IFreezer } from "../models/freezer";

import { LocationsService } from "../services/locations.service";
import { FreezersService } from "../services/freezers.service";

import { LocationsTreeStateService } from '../services/Locations-Tree-State.Service';

import { ValidationModel } from '../customComponents/validation/validation-model.directive'
import { ValidatorService } from "../services/validator.service";
import { Subscription } from 'rxjs/Subscription';

@Component({
    templateUrl: 'locationFreezerManager-add.component.html',
    styleUrls: ['locationFreezerManager-add.component.css'],
    providers: [ValidatorService]
})
export class LocationFreezerManagerAddComponent implements OnInit {

    public selectedLocation = new ILocation();
    public selectedFreezer = new IFreezer();
    private routeSubscription: Subscription;

    type = "freezer";
    isFreezerAdd = true;
    isOfficeAdd: Boolean = false;
    selectedId: number = -1;
        
    name: String;
    public forbidenFreezerNames: string[] = [];   
    
    constructor(
        private freezersService: FreezersService,
        private locationsService: LocationsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private validatorService: ValidatorService) {
    }

    ngOnInit() {
        this.routeSubscription = this.activatedRoute.params.subscribe(params => this.onRouteActivated(params));     
    }

    public onRouteActivated(params) {

        this.type = params["type"];
        this.isFreezerAdd = this.type == "freezer";
        this.selectedId = params["id"];

        this.locationsService.decorateEditingLocationForm(Number(this.selectedId), true).subscribe(
            response => {
                this.name = response.path
                this.isOfficeAdd = response.isOffice;
            });

        if(this.isFreezerAdd) {
            this.freezersService.getFreezersByLocation(this.selectedId).subscribe(
            response => {
                for (var val of response) {
                    if (val.freezerID != this.selectedFreezer.freezerID)
                    this.forbidenFreezerNames.push(val.name);
                }
                //console.log(this.forbidenFreezerNames);
            }); 
        }        
    }
    
    private redirectToLocations() {
        this.router.navigateByUrl('locations');
    }

    public onSubmit() {
        if (this.validatorService.validate()) {
            if (this.isFreezerAdd)
                this.freezerAdd();
            else
                this.locationAdd();
        }
    }

    freezerAdd() {
        
        this.freezersService.validatorService = this.validatorService;

        let freezer = this.selectedFreezer;
        
        if (this.forbidenFreezerNames.indexOf(freezer.name) >= 0) {
            console.log('have this freeze already'); // this is the problem
            return;
        }

        freezer.locationID = this.selectedId;
        
        this.freezersService.insertFreezer(freezer).subscribe(
            response => {
                LocationsTreeStateService.addLocationToPath(freezer.locationID);
                LocationsTreeStateService.setFrezeer(response.NewID);
                this.redirectToLocations();
            }
        );
    }

    validateName(valModel: ValidationModel) {       
        return this.forbidenFreezerNames.indexOf(valModel.value.trim()) < 0;        
    }

    validateTemperature(valModel: ValidationModel): boolean {
        var result = true;

        if (isNaN(valModel.value)) {
            valModel.setValid(false, "The temperature must be a number");
            result = false;
        }

        if (result && (valModel.value > 99) || (valModel.value < -99)) {
            valModel.setValid(false, "The temperature must be between -99 C and 99 C");
            result = false;
        }

        return result;
    }

    validateCapacity(valModel: ValidationModel): boolean {        
        var result = true;

        if (isNaN(valModel.value)) {
            valModel.setValid(false, "The capacity must be a number");
            result = false;
        }

        if (result && (valModel.value < 0)) {
            valModel.setValid(false, "The capacity must be a positive number");
            result = false;
        }
        
        return result;
    }

    locationAdd() {
        this.locationsService.validatorService = this.validatorService;

        this.selectedLocation.parentLocationID = this.selectedId;

        let location = this.selectedLocation;

        //Office adding.
        if (this.isOfficeAdd) {
            this.locationsService.createOffice(location).subscribe(
                response => {
                    LocationsTreeStateService.addLocationToPath(location.parentLocationID, response.NewID);
                    this.redirectToLocations();
                });
        }
        //City adding.
        else {
            this.locationsService.createCity(location).subscribe(
                response => {
                    LocationsTreeStateService.addLocationToPath(location.parentLocationID, response.NewID);
                    this.redirectToLocations();
                });
        }
    }

    cancel() {
        this.router.navigateByUrl('locations');
    }

    /*onChange(value) {
        this.isFreezerAdd = !this.isFreezerAdd;
        this.type = this.isFreezerAdd ? "Freezer" : "Location";
    }*/
}
