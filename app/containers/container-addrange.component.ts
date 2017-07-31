import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { IContainersRange } from '../models/containersRange';
import { IContainerType } from '../models/containerType';

import { ContainersService } from '../services/containers.service';
import { ContainerTypesService } from '../services/containerTypes.service';

import { ValidatorService } from '../services/validator.service';

import { Preloader } from '../customComponents';

import { GlobalVars } from './../global-vars';

@Component({
    templateUrl: 'container-addrange.component.html',
    styleUrls: ['../CustomStyles/AddEditItem.css'],
    providers: [ValidatorService]
})

export class ContainerAddRangeComponent implements OnInit {

    containersRange: IContainersRange = new IContainersRange();
    containerTypes: IContainerType[];

    @ViewChild(Preloader)
    private preloader: Preloader;

    constructor(
        private containersService: ContainersService,
        private containerTypesService: ContainerTypesService,
        public router: Router,
        private globalVariableObject: GlobalVars,
        private validatorService: ValidatorService) {
    }

    ngOnInit() {
        this.containerTypesService.getContainerTypes()
            .subscribe(
            containerTypes => this.containerTypes = containerTypes);
    }

    addContainersRange() {
        if (this.validatorService.validate()) {
            let timeout = 500;
            setTimeout(() => {
                $('.form-horizontal fieldset legend').text('Please wait, additition of new containers in progress...');
                $('#preloader').css('top', '50px');
            }, timeout);
            this.preloader.show(null, timeout);

            this.containersService.validatorService = this.validatorService;
            this.containersService.createContainersRange(this.containersRange).subscribe(
                response => {
                    this.globalVariableObject.lastNavigatedFromAction = "CreateContainerSuccess";
                    this.preloader.hide();
                    this.navigateToContainers();
                },
                error => {
                    this.preloader.hide();
                    console.log(error);
                }
            );
        }
    }

    cancel() {
        this.navigateToContainers();
    }

    navigateToContainers() {
        this.validatorService.clearGlobalMessage();
        this.router.navigateByUrl('containers');
    }

    onContainerTypeChange() {
        this.containersRange.startBarCode = this.containersRange.containerType.prefix;
        this.containersRange.endBarCode = this.containersRange.containerType.prefix;
    }

    BarcodeChange(primaryBarcode: string) {
        let prefix = primaryBarcode.substr(0, 2);
        this.containersRange.containerType = this.containerTypes.find(p => p.prefix === prefix);
        if (!this.containersRange.startBarCode || this.containersRange.startBarCode.substr(0, 2) !== prefix) {
            this.containersRange.startBarCode = prefix;
        }
        if (!this.containersRange.endBarCode || this.containersRange.endBarCode.substr(0, 2) !== prefix) {
            this.containersRange.endBarCode = prefix;
        }
    }
}

