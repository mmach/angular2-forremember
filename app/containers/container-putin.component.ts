import { Component, ViewChild } from '@angular/core';

import { FreezersService, ContainersService, RacksFromMagazineSource, ContainersMagazineOrRackSource, ValidatorService }
    from '../services';
import { IFreezer, IContainer } from '../models';
import { LayoutMap, LayoutMapIndexType, BootstrapSwitchComponent } from '../customComponents';
import { TooltipData } from '../customComponents/layoutMap/models/layoutMap';
import { LayoutMapView } from '../customComponents/layoutMap/layout-map-view/layout-map-view.component';

import { Autocomplete } from '../autocomplete/autocomplete.component';

@Component({
    selector: 'container-putin',
    templateUrl: 'container-putin.component.html',
    providers: [
        { provide: ContainersMagazineOrRackSource, useClass: RacksFromMagazineSource },
        ValidatorService
    ]
})
export class ContainerPutInComponent {
    @ViewChild(Autocomplete)
    autocompleteBarcode: Autocomplete;

    @ViewChild(BootstrapSwitchComponent)
    bootstrapSwitchComponent: BootstrapSwitchComponent;

    freezers: IFreezer[];
    freezerRacks: IContainer[];
    destinationFreezer: IFreezer;
    destinationMagazineRack: IContainer;
    destinationFreezerRack: IContainer;
    container: IContainer;
    position: string;
    parentContainer: IContainer;

    layoutMapForRack: LayoutMap = new LayoutMap();

    @ViewChild(LayoutMapView)
    layoutMapViewForRack: LayoutMapView;

    rackFromFreezerValue: boolean = true;
    rackFromMagazineValue: boolean = false;

    toRack: boolean = false;

    constructor(
        protected freezersService: FreezersService,
        protected containersService: ContainersService,
        private validatorService: ValidatorService
    ) {
    }

    loadData(container: IContainer) {
        this.rackFromFreezerValue = true;
        this.rackFromMagazineValue = false;
        this.toRack = false;
        if (this.bootstrapSwitchComponent) {
            this.bootstrapSwitchComponent.checked = false;
        }

        this.freezers = [];
        this.freezerRacks = [];

        this.container = container;
        this.freezersService
            .getShortFreezerDataByContainerId(container.containerID)
            .subscribe(result => {
                this.freezers = result.freezers;
                if(result.lastFreezerId)
                    this.destinationFreezer = this.freezers.find(x => x.freezerID === result.lastFreezerId)
                }, error => console.error(error)
            );

        this.createLayoutMap();
    }

    rackFromFreezer() {
        this.rackFromFreezerValue = true;
        this.rackFromMagazineValue = false;

        this.loadRacks();
    }

    rackFromMagazine() {
        this.rackFromMagazineValue = true;
        this.rackFromFreezerValue = false;

        this.loadRacks();
    }

    toRackChange() {
        this.rackFromFreezerValue = true;
        this.rackFromMagazineValue = false;

        this.loadRacks();
    }

    loadRacks(freezer: IFreezer = null) {
        this.toRack = this.bootstrapSwitchComponent.checked;

        if (this.rackFromMagazineValue) {
            this.selectRacksFromMagazine();
        }

        if (this.rackFromFreezerValue) {
            this.selectRacksFromFreezer();
        }
    }

    selectRacksFromMagazine() {
        this.reloadLayoutMap();
    }

    selectRacksFromFreezer() {
        this.reloadLayoutMap();
        if (!this.destinationFreezer) {
            return;
        }

        this.containersService.getFreezerRacks(this.destinationFreezer.freezerID)
            .subscribe(racks => this.freezerRacks = racks);
    }

    getPosition() {
        return this.bootstrapSwitchComponent.checked && this.layoutMapForRack.getSelectedCoordinates();
    }

    getParentContainerID() {
        if (!this.bootstrapSwitchComponent.checked) {
            return null;
        }

        if (this.rackFromFreezerValue) {
            return this.destinationFreezerRack && this.destinationFreezerRack.containerID;
        }

        return this.autocompleteBarcode.selectedItem && this.autocompleteBarcode.selectedItem.id;
    }

    validate(): boolean {
        if (this.validatorService.validate()) {
            this.containersService.validatorService = this.validatorService;
            return true;
        }

        return false;
    }

    loadOccupancyForRack() {
        this.layoutMapForRack.setReadOnly(true);
        this.containersService
            .getOccupancy(this.getParentContainerID())
            .subscribe(result =>
                this.updateLayoutMap(result.occupiedPositions, result.vialsList)
            );
    }

    updateLayoutMap(occupiedPositions, vialsList) {
        this.layoutMapForRack.filledItemsCoordinates = occupiedPositions;
        this.layoutMapForRack.setReadOnly(false);
        if (this.container.position)
            this.layoutMapForRack.setSelectedItem(this.container.position);

        let tooltips = vialsList
            .filter(vial => vial.position)
            .map(vial => new TooltipData(vial.position, vial.barCode));

        this.layoutMapForRack.setTooltips(tooltips);
        this.layoutMapViewForRack.generateTooltips();
    }

    reloadLayoutMap(coordinates = '') {
        this.layoutMapForRack.filledItemsCoordinates = coordinates;
    }

    createLayoutMap() {
        this.layoutMapForRack.columnSize = 12;
        this.layoutMapForRack.rowSize = 8;
        this.layoutMapForRack.items = [];
        this.layoutMapForRack.columnIndexType = LayoutMapIndexType.LETTER;
        this.layoutMapForRack.rowIndexType = LayoutMapIndexType.NUMBER;
        this.layoutMapForRack.showSelectAllCheckbox = false;
    }

    onContainerBarcodeChange(event) {
        this.reloadLayoutMap();
    }

    destinationFreezerRackValidation() {
        return !this.bootstrapSwitchComponent.checked || !this.rackFromFreezerValue || this.destinationFreezerRack;
    }

    destinationMagazineRackValidation() {
        return !this.bootstrapSwitchComponent.checked || !this.rackFromMagazineValue ||
            (this.autocompleteBarcode && this.autocompleteBarcode.selectedItem);
    }

    positionValidation() {
        return !this.bootstrapSwitchComponent.checked || this.layoutMapForRack.getSelectedCoordinates();
    }
}
