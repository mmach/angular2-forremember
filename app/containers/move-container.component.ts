import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FreezersService } from './../services/freezers.service';
import { ContainersService } from './../services/containers.service';
import { IFreezer } from '../models/freezer';
import { MoveContainer } from '../models/movecontainer';
import { GlobalVars } from './../global-vars';
import { ConfirmDialogProperties } from '../customComponents/modalWindow/modal-window.component';
import { ModalWindowService } from '../services/modalWindow.service';

import { ValidatorService } from '../services/validator.service';

@Component({
    templateUrl: 'move-container.component.html',
    providers: [ValidatorService]
})

export class MoveContainerComponent implements OnInit {

    freezers: IFreezer[];

    barCode: string = '';
    freezerFrom: string = '';

    destination: IFreezer;
    moveReason: string = '';
    selectedContainerId: number;

    constructor(
        public router: Router,
        protected frs: FreezersService,
        protected cs: ContainersService,
        protected globalVariablesObject: GlobalVars,
        private modalWindowService: ModalWindowService,
        private validatorService: ValidatorService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.selectedContainerId = +this.route.snapshot.params['containerid'];
        /// This method fills the source freezer combobox
        this.frs.getShortFreezerDataByContainerId(this.selectedContainerId)
            .subscribe(
            resp => this.freezers = resp.freezers);
        ///
        /// call the method that retrieves the list of containers with the whole rage of information as containerId, 
        /// related freezer, locaiton, and so on. NEEDED TO FILL THE FORM IN MOVING CONTAINERS
        ///
        this.cs.getDataToMoveContainer(this.selectedContainerId).
            subscribe(
            ctr => {
                this.barCode = ctr.barCode;
                this.freezerFrom = ctr.freezer.fullPath;
            });

    }

    redirectToContainers() {
        this.router.navigateByUrl('containers');
    }

    public onSubmit() {
        if (!this.validatorService.validate()) {
            return;
        }

        this.cs.validatorService = this.validatorService;
        let thisRef = this;

        if (this.destination.usedSpace < 0) {
            let confirmDialogProperties = new ConfirmDialogProperties();
            confirmDialogProperties.onConfirmed = function () {

                let sendData: MoveContainer = {
                    containerId: 0,
                    freezerID: 0,
                    reason: ''
                };
                sendData.containerId = +thisRef.selectedContainerId;
                sendData.freezerID = (<any>thisRef).destination.freezerID;
                sendData.reason = thisRef.moveReason;

                thisRef.cs.MoveContainer(sendData)
                    .subscribe(response => thisRef.router.navigateByUrl('containers'));
            };
            let message = ['There is no free space in the destination freezer! Proceed anyway?'];
            this.modalWindowService.show('Move container', message, undefined, confirmDialogProperties);

        } else {
            let sendData: MoveContainer = {
                containerId: 0,
                freezerID: 0,
                reason: ''
            };
            sendData.containerId = +thisRef.selectedContainerId;
            sendData.freezerID = (<any>thisRef).destination.freezerID;
            sendData.reason = thisRef.moveReason;

            this.cs.MoveContainer(sendData).subscribe(
                response => thisRef.router.navigateByUrl('containers'));
        }
    }
}




