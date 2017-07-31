import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

import { ILocation } from "../models/location";
import { IFreezer } from "../models/freezer";

import { ValidatorService } from "../services/validator.service";
import { FreezersService } from '../services/freezers.service';

import { LocationsService } from "../services/locations.service";
import { ValidationModel } from '../customComponents/validation/validation-model.directive';

import { Subscription } from 'rxjs/Subscription';

@Component({
    templateUrl: 'locationFreezerManager-edit.component.html',
    providers: [ValidatorService]
})
export class LocationFreezerManagerEditComponent implements OnInit {
    pageType = "";
    isLocationEdit = true; //else = FreezerEdit
    selectedId = "";

    name: String = "";
    isOfficeUpdate: Boolean = false;

    selectedLocation = new ILocation();
    selectedFreezer = new IFreezer();

    showControls = true;

    freezers: IFreezer[];

    public forbidenFreezerNames: string[] = [];
    private routeSubscription: Subscription;

    constructor(private freezersService: FreezersService,
        private locationsService: LocationsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private validatorService: ValidatorService) {
    }

    ngOnInit() {
        this.routeSubscription = this.activatedRoute.params.subscribe(params => this.onRouteActivated(params));        
    }

    onRouteActivated(params): void {

        this.pageType = params['type'];
        this.isLocationEdit = this.pageType == 'location';
        this.selectedId = params['id'];
        
        if (this.validatePageInit() && this.isLocationEdit) {            
                this.locationsService.decorateEditingLocationForm(Number(this.selectedId), false).subscribe(
                    response => {
                        this.name = response.path
                        this.isOfficeUpdate = response.isOffice;
                    },
                    error => this.validatorService.setGlobalErrorMessage(error));
        }

        if (!this.validatePageInit()) {
            this.showControls = false;
            return;
        }

        let selectedId = parseInt(this.selectedId);
        if (this.isLocationEdit) {
            this.locationsService.getLocationById(selectedId).subscribe(
                location => this.selectedLocation = location,
                error => {
                    this.showControls = false;
                }
            );
        }
        else {
            this.freezersService.getFreezer(selectedId).subscribe(
                freezer => {
                    this.selectedFreezer = freezer;
                    this.freezersService.getFreezersByLocation(freezer.locationID).subscribe(
                        response => {
                            for (var val of response) {
                                if (val.freezerID != this.selectedFreezer.freezerID)
                                this.forbidenFreezerNames.push(val.name);
                            }
                        });
                },
                error => {
                    this.showControls = false;
                }
            );

            
        }
    }

    private validatePageInit() {
        var isValid = true;

        let selectedId = parseInt(this.selectedId);

        if (!this.selectedId || isNaN(selectedId)) {
            this.validatorService.setGlobalErrorMessage("Id is not well formed.");
            isValid = false;
        }

        if (this.pageType != "location" && this.pageType != "freezer") {
            this.validatorService.setGlobalErrorMessage("Page type request is not expected.");
            isValid = false;
        }

        return isValid;
    }

    public onSubmit() {
        if (this.validatorService.validate()) {
            if (this.isLocationEdit) {
                this.locationSubmit();
            }
            else {
                this.freezerSubmit();
            }
        }
    }

    locationSubmit() {
        
        this.locationsService.validatorService = this.validatorService;
        
        //Office updating.
        if (this.isOfficeUpdate) {
            this.locationsService.updateOffice(this.selectedLocation).subscribe(
                response => {
                    console.log(response);
                    if (response.ErrorCode == 0) {
                        this.redirectToLocations();
                    }
                    
                }
            );
        }
        //City updating.
        else {
            this.locationsService.updateCity(this.selectedLocation).subscribe(
                response => {
                    if (response.ErrorCode == 0) {
                        this.redirectToLocations();
                    }
                }
            );
        }
    }

    freezerSubmit() {



        this.freezersService.validatorService = this.validatorService;
        
        this.freezersService.updateFreezer(this.selectedFreezer).subscribe(
            response => {
                
                if (response.ErrorCode == 0) {
                    this.redirectToLocations();
                }
                else {
                    
                    this.validatorService.setGlobalErrorMessage(response.ErrorDescription);
                }
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

    cancel() {
        this.router.navigateByUrl('locations');
    }

    private redirectToLocations() {
        this.router.navigateByUrl('locations');
    }
}
