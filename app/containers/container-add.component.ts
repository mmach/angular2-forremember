import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IContainer } from '../models/container';
import { IContainerType } from '../models/containerType';

import { ContainersService } from '../services/containers.service';
import { ContainerTypesService } from '../services/containerTypes.service';

import { ValidationModel } from '../customComponents/validation/validation-model.directive';
import { ValidatorService } from '../services/validator.service';

import { GlobalVars } from '../global-vars';

@Component({
    templateUrl: 'container-add.component.html',
    styleUrls: ['../CustomStyles/AddEditItem.css'],
    providers: [ValidatorService]
})
export class ContainerAddComponent implements OnInit {

    newContainer: IContainer = new IContainer();

    containerTypes: IContainerType[];

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
            containerTypes => {
                this.containerTypes = containerTypes;
            });
    }

    onContainerTypeChange() {
        this.newContainer.barCode = this.newContainer.containerType.prefix;
    }

    BarcodeChange() {
        let prefix = this.newContainer.barCode.substr(0, 2);
        this.newContainer.containerType = this.containerTypes.find(p => p.prefix === prefix);
    }

    addContainer() {
        if (this.validatorService.validate()) {
            this.containersService.validatorService = this.validatorService;
            this.containersService.createContainer(this.newContainer).subscribe(
                response => {
                    this.globalVariableObject.lastNavigatedFromAction = "CreateContainerSuccess";
                    this.navigateToContainers();
                });
        }
    }

    cancel() {
        this.navigateToContainers();
    }

    navigateToContainers() {
        this.validatorService.clearGlobalMessage();
        this.router.navigateByUrl('containers');
    }
}

