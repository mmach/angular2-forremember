import { Component, OnInit, ViewChildren, ViewChild, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ContainersService, CqrsService, FreezersService,
    ModalWindowService, ValidatorService } from '../../services';

import { ICompound, IConcept, IContainer, IContainerType, IFreezer, ILocation,
    ISplitCompund, ContainerTypeEnum } from '../../models';

import { Autocomplete } from '../../autocomplete/autocomplete.component';
import { BootstrapSwitchComponent } from '../../customComponents/bootstrapSwitch/bootstrapSwitch.component';
import { LayoutMap, LayoutMapIndexType, TooltipData } from '../../customComponents/layoutMap/models/layoutMap';

import { ContainerTypesService } from '../../services/containerTypes.service';


declare var flatpickr: any;

@Component({
    templateUrl: 'concept-split.component.html',
    styleUrls: ['concept-split.component.css'],
    providers: [ValidatorService]
})
export class ConceptSplitComponent implements OnInit {

    @ViewChildren(Autocomplete)
    autocompleteInputs: QueryList<Autocomplete>;

    @ViewChild(BootstrapSwitchComponent)
    bootstrapSwitchComponent: BootstrapSwitchComponent;

    public isDatepickerInited: boolean;
    private targetRackRequired: boolean;
    private rackFromFreezer: boolean;
    private rackFromMagazine: boolean;
    public layoutMap: LayoutMap;
    public errorMessage: string;
    public container: IContainer;
    public model: ISplitCompund;
    public containerId: number;
    public containerTypes: IContainerType[];
    public targetContainerType: IContainerType;
    public freezers: IFreezer[];
    private freezerRacks: IContainer[] = [];
    private magazineFreezerRack: IContainer;
    public targetFreezer: IFreezer;
    private destinationFreezerRack: IContainer;
    public targetRackBarcode: string;
    public expDate: string;
    public prodDate: string;
    constructor(private router: Router,
        private route: ActivatedRoute,
        private containersService: ContainersService,
        private containerTypesService: ContainerTypesService,
        private freezersService: FreezersService,
        private cqrsService: CqrsService,
        private validatorService: ValidatorService,
        private modalWindowService: ModalWindowService) {

        this.container = new IContainer();
        this.container.compound = new ICompound();
        this.container.compound.concept = new IConcept();
        this.container.freezer = new IFreezer();
        this.container.freezer.location = new ILocation();
        this.container.containerType = new IContainerType();

        this.targetRackRequired = false;
        this.rackFromFreezer = true;
        this.rackFromMagazine = false;

        this.containerTypes = [new IContainerType()];
        this.targetContainerType = new IContainerType();
        this.layoutMap = new LayoutMap();
        this.layoutMap.showSelectAllCheckbox = true;
        this.layoutMap.columnSize = 12;
        this.layoutMap.rowSize = 8;
        this.layoutMap.columnIndexType = LayoutMapIndexType.LETTER;
        this.layoutMap.rowIndexType = LayoutMapIndexType.NUMBER;

        this.targetFreezer = new IFreezer();
        this.targetFreezer.fullPath = '';
        this.freezers = new Array<IFreezer>();


        this.model = new ISplitCompund();
        this.model.Amount = 0;
        this.model.ParentContainerBarcode = '';
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => this.onRouteActivated(params));
    }

    public onRouteActivated(params) {
        this.containerId = params['containerId'];
        this.GetContainerDetails();

        this.containerTypesService.getContainerTypes()
            .subscribe(
            containerTypes => {
                this.containerTypes = containerTypes.filter(p => p.canContainCompound);
            },
            error => this.errorMessage = <any>error);

        // this.freezersService
        //     .getFreezers()
        //     .subscribe(p => { this.freezers = this.freezers.concat(p.sort((a, b) => { return a.fullPath > b.fullPath ? 1 : -1; })); },
        //     e => {
        //     });

        this.freezersService.getShortFreezerDataByContainerId(this.containerId)
            .subscribe(resp => {
                this.freezers = resp.freezers;
                if (resp.lastFreezerID) {
                    this.targetFreezer = this.freezers.find(x => x.freezerID === resp.lastFreezerID);
                }
            });
    }

    public GetContainerDetails(): any {
        this.cqrsService.executeQuery('GetContainerDetailsAction', { 'ContainerId': this.containerId }).subscribe(
            containers => {
                this.container = containers;
                this.expDate = this.container.compound.expirationDate.toString().substr(0, 10);
                this.prodDate = this.container.compound.productionDate.toString().substr(0, 10);
                if (this.container.amount <= 0) {
                    this.cqrsService.infoMsgBroadcast('Container-' + this.container.containerID + ' is empty');
                    setTimeout(() => {
                        this.router.navigate(['/containers']);
                    }, 100);
                }
            },
            error => {
                setTimeout(() => {
                    this.router.navigate(['/containers']);
                }, 2000);
            });
    }

    onFastaButtonClick(fastaString, name) {
        let title = `FASTA for concept ${name} (${fastaString.length} aa)`;
        this.modalWindowService.show(title, [fastaString], { smallText: true });
    }

    amountLeft(): number {
        return this.container.amount > this.model.Amount ? this.container.amount - this.model.Amount : 0;
    }

    onTargetFreezerChange() {
        this.loadRacks();
    }

    onTargetContainerTypeChange() {
        let barcodeAutocomplete = this.autocompleteInputs.toArray()[0];
        barcodeAutocomplete.query = this.targetContainerType.prefix;
    }

    onSelectRackChange() {
        this.loadRacks();
    }


    onContainerBarcodeChange(event) {
        if (event.value) {
            let barcode = event.value;
            this.model.ContainerBarcode = barcode;
            let prefix = barcode.slice(0, 2);
            this.targetContainerType = this.containerTypes.find(p => p.prefix === prefix);
            if (this.targetContainerType) {
                this.layoutMap.showSelectAllCheckbox = this.targetContainerType.containerTypeID === 1;
            }
        }
    }


    // onParentContainerBarcodeChange(event) {
    //     if (event.value) {
    //         this.model.ParentContainerBarcode = event.value;
    //     }

    //     this.model.Position = '';
    //     this.layoutMap.filledItemsCoordinates = '';
    //     this.layoutMap.setReadOnly(true);
    //     let parentBarcodeAutocomplete = this.autocompleteInputs.toArray()[1];

    //     if (parentBarcodeAutocomplete.selectedItem != null && parentBarcodeAutocomplete.selectedItem.id != null) {
    //         let parentContainerId = parentBarcodeAutocomplete.selectedItem.id;
    //         this.containersService
    //             .getOccupancy(parentContainerId)
    //             .subscribe(result =>
    //                 this.updateLayoutMap(result.occupiedPositions, result.vialsList)
    //             );
    //     }
    // }
    onParentContainerBarcodeChange(event) {
        if (event.value) {
            this.targetRackBarcode = event.value;
        }
    }


    updateLayoutMap(occupiedPositions, vialsList) {
        this.layoutMap.filledItemsCoordinates = occupiedPositions;
        this.layoutMap.setReadOnly(false);

        let tooltips = vialsList
            .filter(vial => vial.position)
            .map(vial => new TooltipData(vial.position, vial.barCode));

        this.layoutMap.setTooltips(tooltips);
    }

    BarcodeChange() {
        let prefix = this.model.ContainerBarcode.substr(0, 2);
        this.targetContainerType = this.containerTypes.find(p => p.prefix === prefix);
    }

    onCancelButton() {
        this.router.navigateByUrl('containers');
    }

    RackRequired() {
        if (this.targetRackRequired === true) {
            this.model.ParentContainerBarcode = 'rc';
        } else {
            this.model.ParentContainerBarcode = '';
        }
    }


    onRackSourceChange(source) {
        if (source === 1) {
            this.rackFromFreezer = true;
            this.rackFromMagazine = false;
        } else {
            this.cleanLayoutMap();
            this.rackFromFreezer = false;
            this.rackFromMagazine = true;
            if (!this.targetRackBarcode) {
                this.targetRackBarcode = 'rc';
            }
        }
        this.loadRacks();
    }

    loadRacks(freezer: IFreezer = null) {
        if (this.bootstrapSwitchComponent) {
            this.targetRackRequired = this.bootstrapSwitchComponent.checked;
        }

        if (this.targetFreezer && this.targetRackRequired && this.rackFromFreezer) {
            this.cleanLayoutMap();
            this.loadRacksFromFreezer();
        }
    }

    loadRacksFromFreezer() {
        if (!this.targetFreezer) {
            return;
        }

        this.containersService.getFreezerRacks(this.targetFreezer.freezerID)
            .subscribe((function (racks) {
                this.freezerRacks = racks;
                if (this.destinationFreezerRack) {
                    this.destinationFreezerRack =
                        this.freezerRacks.filter(r => r.containerID === this.destinationFreezerRack.containerID)[0];
                    this.loadOccupancyForRack();
                }
            }).bind(this));
    }

    loadOccupancyForRack() {
        if (this.destinationFreezerRack && this.destinationFreezerRack.containerID) {
            this.containersService.getOccupancy(this.destinationFreezerRack.containerID)
                .subscribe(x => this.reloadLayoutMap(x));
        }
    }

    reloadLayoutMap(coordinates = '') {
        // occupiedPositions implemented in a such way, because it's a type of any
        this.layoutMap.filledItemsCoordinates = coordinates['occupiedPositions'];
    }

    private cleanLayoutMap() {
        this.layoutMap.filledItemsCoordinates = '';
    }


    addNewContainer() {
        this.GetContainerDetails();
        if (this.targetContainerType) {
            this.onTargetContainerTypeChange();
            if (this.targetContainerType.containerTypeID === 1) { // plate with wells
                this.layoutMap.refresh();
            } else if (this.targetContainerType.containerTypeID === 3) { // Vial
                if (this.targetRackRequired && this.rackFromFreezer) {
                    this.cleanLayoutMap();
                    this.loadOccupancyForRack();
                } else {
                    let selectedRack = this.autocompleteInputs.filter(i => i.query === this.targetRackBarcode)[0].selectedItem;
                    $('input[value="rackFromFreezer"]').prop('checked', true);
                    this.rackFromFreezer = true;
                    this.rackFromMagazine = false;
                    this.destinationFreezerRack = new IContainer(
                        {
                            containerID: selectedRack.id,
                            barCode: selectedRack.name
                        });
                    this.cleanLayoutMap();
                    this.loadRacksFromFreezer();
                }
            }
        }
    }

    splitAndAddNewContainer() {
        this.splitCompound(true);
    }

    splitCompound(addNewContainer: boolean) {
        this.cqrsService.validatorService = this.validatorService;
        if (this.validatorService.validate()) {

            this.model.ExpirationDate = this.container.compound.expirationDate.toString();
            this.model.ProductionDate = this.container.compound.productionDate.toString();
            this.model.Purity = this.container.compound.purity;
            this.model.Position = '';
            if (this.targetContainerType['containerTypeID'] === ContainerTypeEnum.Vial ||
                this.targetContainerType['containerTypeID'] === ContainerTypeEnum.PlateWithWells) {

                this.model.Position = this.layoutMap.getSelectedCoordinates();
            }
            this.model.FreezerId = this.targetFreezer.freezerID;

            this.model.IgnoreFreezerCapacity = false;
            this.model.ContainerId = this.containerId;
            this.model.Name = this.container.compound.concept.name;

            if (this.targetRackRequired) {
                if (this.rackFromFreezer) {
                    this.model.ParentContainerBarcode = this.destinationFreezerRack.barCode;
                } else if (this.rackFromMagazine) {
                    this.model.ParentContainerBarcode = this.targetRackBarcode;
                } else {
                    this.model.ParentContainerBarcode = '';
                }
            }


            this.cqrsService
                .execute('SplitCompoundAction', this.model)
                .subscribe(result => {
                    this.cqrsService.succMsgBroadcast('New container has been added');
                    if (addNewContainer) {
                        this.addNewContainer();
                    } else {
                        setTimeout(() => {
                            this.router.navigate(['/containers']);
                        }, 100);
                    }
                });
        }
    }
}
