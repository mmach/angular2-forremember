import { Component, ViewChild } from '@angular/core';

import { ContainersService } from './../services/containers.service';
import { IContainer } from '../models/container';
import { LayoutMapView } from '../customComponents/layoutMap/layout-map-view/layout-map-view.component';
import { LayoutMap, LayoutMapIndexType, TooltipData } from '../customComponents/layoutMap/models/layoutMap';
import { CustomPropertiesComponent } from '../CustomProperties/customProperties.component';
import { CustomPropertiesService } from '../services/customproperties.service';
import { ContainerTypeEnum } from '../models/ContainerTypeEnum';
import { CqrsService } from '../services/cqrs.service';
import { ModalWindowService } from '../services/modalWindow.service';

@Component({
    selector: 'container-details',
    templateUrl: 'container-details.component.html'
})
export class ContainerDetailsComponent {

    @ViewChild(CustomPropertiesComponent)
    customPropertiesComponent: CustomPropertiesComponent;

    @ViewChild(LayoutMapView)
    layoutMapView: LayoutMapView;

    container: IContainer;
    parentContainer: IContainer;

    productionDate: Date;
    expirationDate: Date;
    customProperties;
    layoutMap: LayoutMap = new LayoutMap();
    showLayoutMap: boolean;


    constructor(
        private containersService: ContainersService,
        private customPropertiesService: CustomPropertiesService,
        private cqrsService: CqrsService,
        private modalWindowService: ModalWindowService
    ) {
    }

    onFastaButtonClick(fastaString, name) {
        let title = `FASTA for concept ${name} (${fastaString.length} aa)`;
        this.modalWindowService.show(title, [fastaString], { smallText: true });
    }

    loadData(container: IContainer) {
        this.container = container;
        this.loadCompound();

        this.loadLayoutMap();
    }

    loadCompound() {
        this.productionDate = null;
        this.expirationDate = null;        
        if (!this.container.compound) {
            return;
        }
        // TODO some general approach for serializing dates
        if (this.container.compound.expirationDate) {
            this.expirationDate = new Date(Date.parse(this.container.compound.expirationDate.toString()));
        }
        if (this.container.compound.productionDate) {
            this.productionDate = new Date(Date.parse(this.container.compound.productionDate.toString()));
        }

        this.customPropertiesService
            .getAllProperties(this.container.compound.conceptID)
            .subscribe(prop => this.setCustomProperties(prop));
    }

    loadLayoutMap() {
        this.parentContainer = null;
        this.showLayoutMap = this.container.containerTypeID !== ContainerTypeEnum.Vial ||
            !!this.container.parentID;
           
        if (!this.showLayoutMap) {
            return;
        }

        this.layoutMap.columnSize = 12;
        this.layoutMap.rowSize = 8;
        this.layoutMap.items = [];
        this.layoutMap.columnIndexType = LayoutMapIndexType.LETTER;
        this.layoutMap.rowIndexType = LayoutMapIndexType.NUMBER;
        this.layoutMap.items = [];

        let layoutContainerID = this.container.parentID || this.container.containerID;
        if (this.container.containerTypeID === ContainerTypeEnum.Vial) {
            this.cqrsService.executeQuery('GetContainerDetailsAction', { ContainerId: this.container.parentID })
                .subscribe(x => this.parentContainer = x);
        }
        
        this.containersService
            .getOccupancy(layoutContainerID)
            .subscribe(result => 
                this.updateLayoutMap(result.occupiedPositions, result.vialsList)
            );
    }

    updateLayoutMap(occupiedPositions, vialsList) {
        this.layoutMap.filledItemsCoordinates = occupiedPositions;
        this.layoutMap.setReadOnly(true);
        if (this.container.position)
            this.layoutMap.setSelectedItem(this.container.position);

        let tooltips = vialsList
            .filter(vial => vial.position)
            .map(vial => new TooltipData(vial.position, vial.barCode));

        this.layoutMap.setTooltips(tooltips);
        this.layoutMapView.generateTooltips();
    }

    public setCustomProperties(customProperties) {
        this.customProperties = customProperties;
        this.customPropertiesComponent.setCustomProperties(customProperties);
        this.customPropertiesComponent.setReadonly(true);
    }
}
