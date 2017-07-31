import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Autocomplete } from '../../autocomplete/autocomplete.component';
import { BootstrapSwitchComponent } from '../../customComponents/bootstrapSwitch/bootstrapSwitch.component';
import { CompoundProduceForm } from '../../models/CompoundProduceForm';
import { ConceptsService } from '../../services/concepts.service';
import { ContainersService } from '../../services/containers.service';
import { ContainerTypeEnum } from '../../models/ContainerTypeEnum';
import { ContainerTypesService } from '../../services/containerTypes.service';
import { CqrsService } from '../../services/cqrs.service';
import { CustomPropertiesComponent } from '../../CustomProperties/customProperties.component';
import { CustomPropertiesService } from '../../services/customproperties.service';
import { FreezersService } from '../../services/freezers.service';
import { IContainer } from '../../models/container';
import { IContainerType } from '../../models/containerType';
import { IFreezer } from '../../models/freezer';
import { LayoutMap, LayoutMapIndexType } from '../../customComponents/layoutMap/models/layoutMap';
import { ValidationModel } from '../../customComponents/validation/validation-model.directive';
import { ValidatorService } from '../../services/validator.service';

declare var flatpickr: any;

@Component({
    templateUrl: 'concept-produce.component.html',
    styleUrls: ['concept-produce.component.css'],
    providers: [ValidatorService]
})
export class ConceptProduceComponent implements OnInit, AfterViewInit {
    @ViewChild(CustomPropertiesComponent)
    customPropertiesComponent: CustomPropertiesComponent;

    @ViewChildren(Autocomplete)
    autocompleteInputs: QueryList<Autocomplete>;

    @ViewChild(BootstrapSwitchComponent)
    bootstrapSwitchComponent: BootstrapSwitchComponent;

    private isDatepickerInited: boolean;
    private containerTypes: IContainerType[];
    private freezers: Array<IFreezer>;
    private freezerRacks: IContainer[] = [];
    private freezerPlates: IContainer[] = [];

    private destinationFreezerRack: IContainer;
    private destinationFreezerPlate: IContainer;
    private targetRackRequired: boolean;
    private rackFromFreezer: boolean;
    private rackFromMagazine: boolean;
    private layoutMapForRack: LayoutMap;
    private layoutMapForPlate: LayoutMap;
    private customProperties;
    private showContainerBarCode: boolean;
    private plateFromMagazine: boolean;

    private lifeHack: any;

    private conceptId;
    private name;
    private amount;
    private targetFreezer;
    private purity;
    private productionDate;
    private expirationDate;
    private selectedContainerType;
    private targetContainerBarcode;
    private targetRackBarcode;
    private refresh: boolean;

    private filledPLBarCode = "";

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private containersService: ContainersService,
        private freezersService: FreezersService,
        private customPropertiesService: CustomPropertiesService,
        private conceptsService: ConceptsService,
        private containerTypesService: ContainerTypesService,
        private cqrsService: CqrsService,
        private validatorService: ValidatorService) {

        this.isDatepickerInited = false;
        this.targetRackRequired = false;
        this.rackFromFreezer = true;
        this.rackFromMagazine = false;
        this.plateFromMagazine = true;

        this.layoutMapForPlate = new LayoutMap();
        this.refresh = false;
        this.layoutMapForPlate.showSelectAllCheckbox = true;
        this.layoutMapForPlate.columnSize = 12;
        this.layoutMapForPlate.rowSize = 8;
        this.layoutMapForPlate.columnIndexType = LayoutMapIndexType.LETTER;
        this.layoutMapForPlate.rowIndexType = LayoutMapIndexType.NUMBER;
        this.layoutMapForRack = this.layoutMapForPlate;

    }

    ngOnInit() {
        this.route.params.subscribe(params => this.onRouteActivated(params));

        this.containerTypesService.getContainerTypes()
            .subscribe(
            containerTypes => {
                this.containerTypes = containerTypes.filter(p => p.canContainCompound);
            });

        this.productionDate = this.getTodayDate();
    }

    ngAfterViewInit() {

        if (!this.isDatepickerInited) {
            let today = this.getTodayDate();
            flatpickr('#production-date', {
                timeFormat: 'y:m:d',
                defaultDate: today
            });
            flatpickr('#expiration-date', {
                timeFormat: 'y:m:d',
                mindate: today,
                onChange: (dateObj, dateStr) => {
                    this.expirationDate = dateStr;
                }
            });
        }

        this.customPropertiesService
            .getAllProperties(parseInt(this.conceptId, 10))
            .subscribe(prop => {
                this.setCustomProperties(prop);
                this.customProperties = prop;
            });
    }


    private onRouteActivated(params) {
        this.conceptId = params['conceptid'];

        this.conceptsService.getConceptByID(this.conceptId)
            .subscribe(p => this.name = p.name);

        this.freezersService.getShortFreezerData('0')
            .subscribe(
            result => {
                this.freezers = result;
            },
            error => {
                console.error(error);
            }
            );
    }

    AddOtherConcept() {
        if (this.selectedContainerType) {
            this.onContainerTypeChange();
            if (this.selectedContainerType.containerTypeID === 1) { // plate with wells
                this.layoutMapForPlate.refresh();
            } else if (this.selectedContainerType.containerTypeID === 3) { // Vial
                if (this.targetRackRequired && this.rackFromFreezer) {
                    this.cleanLayoutMap();
                    this.loadOccupancyForRack();
                } else {
                    let selectedRack = this.autocompleteInputs.filter(i => i.query === this.targetRackBarcode)[0].selectedItem;
                    $('input[value="rackFromFreezer"]').prop('checked', true);
                    this.onRackSourceChange(1);
                    this.destinationFreezerRack = new IContainer(
                        {
                            containerID: selectedRack.id,
                            barCode: selectedRack.name
                        });
                    this.cleanLayoutMap();
                    this.loadOccupancyForRack();
                }
            }
        }
    }


    onProduceButton(addOtherConcept = false) {
        
        if (this.validatorService.validate()) {
            this.cqrsService.validatorService = this.validatorService;
            let compoundProduceForm = this.fillCompound();
            
            this.cqrsService
                .execute('CompoundProduceAction', compoundProduceForm)
                .subscribe(result => {
                    if (result.errorCode === 0) {
                        this.cqrsService.succMsgBroadcast('New concept has been produced');
                        if (!addOtherConcept) {
                            this.router.navigateByUrl('concepts');
                        } else {
                            this.AddOtherConcept();
                        }
                    }
                });
        }
    }

    onProduceAndAddButton() {
        this.onProduceButton(true);
    }

    fillCompound(): CompoundProduceForm {

        let compoundProduceForm: CompoundProduceForm = new CompoundProduceForm();

        compoundProduceForm.Name = this.name;
        compoundProduceForm.ContainerBarcode = this.targetContainerBarcode;

        if (this.targetRackRequired && this.destinationFreezerRack) {
            compoundProduceForm.ParentContainerBarcode = this.destinationFreezerRack.barCode;
        } else if (this.targetRackRequired && this.targetRackBarcode) {
            compoundProduceForm.ParentContainerBarcode = this.targetRackBarcode;
        } else {
            compoundProduceForm.ParentContainerBarcode = '';
        }

        if (this.selectedContainerType.containerTypeID === 1){
            if (!this.plateFromMagazine)
                compoundProduceForm.ContainerBarcode = this.destinationFreezerPlate.barCode;
        }

        compoundProduceForm.FreezerId = this.targetFreezer;
        compoundProduceForm.Amount = this.amount;

        if (this.selectedContainerType && this.selectedContainerType.containerTypeID === 3) {
            compoundProduceForm.Position = this.layoutMapForRack.getSelectedCoordinates();
        } else if (this.selectedContainerType && this.selectedContainerType.containerTypeID === 1) {
            compoundProduceForm.Position = this.layoutMapForPlate.getSelectedCoordinates();
        } else {
            compoundProduceForm.Position = '';
        }

        compoundProduceForm.Purity = this.purity;
        compoundProduceForm.ProductionDate = this.getTodayDate();
        compoundProduceForm.ExpirationDate = this.expirationDate;
        compoundProduceForm.UserId = 75;
        compoundProduceForm.IgnoreFreezerCapacity = false;
        return compoundProduceForm;
    }

    isNumberKey(evt) {
        let isNumberKey = true;

        if (evt) {
            let charCode = (evt.which) ? evt.which : (<any>event).keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                isNumberKey = false;
            }
        } else {
            if (isNaN(parseInt(this.purity, 10))) {
                isNumberKey = false;
            }
            if (isNumberKey && this.purity % 1 !== 0) {
                isNumberKey = false;
            }
        }

        return isNumberKey;
    }

    onCancelButton() {
        this.router.navigateByUrl('concepts');
    }

    getTodayDate() {
        let now = new Date();
        let monthString = (now.getMonth() + 1).toString();
        if (monthString.length === 1) {
            monthString = '0' + monthString;
        }
        let dayString = now.getDate().toString();
        if (dayString.length === 1) {
            dayString = '0' + dayString;
        }
        return now.getFullYear() + '-' + monthString + '-' + dayString;
    }

    public setCustomProperties(customProperties) {
        this.customPropertiesComponent.setCustomProperties(customProperties);
        this.customPropertiesComponent.setReadonly(true);
    }

    onTargetFreezerChange() {
        this.loadRacks();
        this.loadPlates();
    }

    onContainerTypeChange() {
        let barcodeAutocomplete = this.autocompleteInputs.toArray()[0];

        if (barcodeAutocomplete)
            barcodeAutocomplete.query = this.selectedContainerType.prefix;

        if (this.selectedContainerType) {
            this.layoutMapForRack.showSelectAllCheckbox = this.selectedContainerType.containerTypeID === ContainerTypeEnum.PlateWithWells;

            if (this.selectedContainerType.containerTypeID === ContainerTypeEnum.PlateWithWells) {

            }
        }
    }

    onSwitchPlateTargetChange() {

        this.plateFromMagazine = !this.plateFromMagazine;

        this.cleanLayoutMap();
        console.log(this.autocompleteInputs.toArray()[0]);

        setTimeout( () => {
            let barcodeAutocomplete = this.autocompleteInputs.toArray()[0];
            if (barcodeAutocomplete)
                barcodeAutocomplete.query = this.selectedContainerType.prefix;
        }, 0);
    }

    onContainerBarcodeChange(event) {
        if (event.value) {
            let barcode = event.value;
            this.targetContainerBarcode = barcode;
            let prefix = barcode.slice(0, 2);
            this.selectedContainerType = this.containerTypes.find(p => p.prefix === prefix);

            if (this.selectedContainerType && this.selectedContainerType.containerTypeID === ContainerTypeEnum.PlateWithWells) {
                this.layoutMapForRack.showSelectAllCheckbox = true;
                this.targetRackRequired = false;
            }
            else {
                this.layoutMapForRack.showSelectAllCheckbox = false;
                this.targetRackRequired = true;
            }
        }
    }

    onContainerBarcodeClose($event) {
        if ($event.value.indexOf('pl') >= 0) {
            if (this.filledPLBarCode != $event.value) {
                this.filledPLBarCode = $event.value;
                this.containersService.GetContainerByBarCode1($event.value)
                    .subscribe(resultID =>
                        this.containersService
                            .getOccupancy(resultID)
                            .subscribe(result => {
                                if (result.occupiedPositions != "")
                                    this.layoutMapForRack.filledItemsCoordinates = result.occupiedPositions;
                            })
                    );
            }
        }

    }

    onParentContainerBarcodeChange(event) {
        if (event.value) {
            this.targetRackBarcode = event.value;

        }
    }

    onSelectRackChange() {
        this.loadRacks();
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

    loadPlates(freezer: IFreezer = null) {
        this.loadPlatesFromFreezer();
    }

    loadRacksFromFreezer() {

        if (!this.targetFreezer) {
            return;
        }

        this.containersService.getFreezerRacks(this.targetFreezer)
            .subscribe(racks => {
                this.freezerRacks = racks;
                if (this.destinationFreezerRack) {
                    this.destinationFreezerRack =
                        this.freezerRacks.filter(r => r.containerID === this.destinationFreezerRack.containerID)[0];
                    this.loadOccupancyForRack();
                }
            });
    }

    loadPlatesFromFreezer() {
        if (!this.targetFreezer) {
            return;
        }

        this.containersService.getFreezerPlates(this.targetFreezer)
            .subscribe(plates => {
                this.freezerPlates = plates;

                if (this.destinationFreezerPlate) {
                    this.destinationFreezerPlate =
                        this.freezerRacks.filter(r => r.containerID === this.destinationFreezerPlate.containerID)[0];
                }
            });
    }

    validateContainerBarcode(valModel: ValidationModel) {
        return valModel.value && (<string>valModel.value).toLowerCase() !== 'pl' && (<string>valModel.value).toLowerCase() !== 'vl';
    }

    validateContainerRackBarcode(valModel: ValidationModel) {
        let isValid = true;
        let error = '';

        if (valModel.value) {
            if ((<string>valModel.value).toLowerCase() === 'rc') {
                isValid = false;
                error = 'Value cannot be rc only';
            } else if (isNaN(parseInt((<string>valModel.value).substring(2), 10))) {
                isValid = false;
                error = 'The value after rc must be a number.';
            }
        } else {
            isValid = false;
            error = 'Value cannot be empty';
        }
        if (!isValid) {
            valModel.setValid(false, 'Value cannot be rc only');
        }

        return isValid;
    }

    destinationFreezerRackValidation() {
        return !this.rackFromFreezer || this.destinationFreezerRack;
    }

    loadOccupancyForRack() {
        if (this.destinationFreezerRack && this.destinationFreezerRack.containerID) {
            this.containersService.getOccupancy(this.destinationFreezerRack.containerID)
                .subscribe(x => this.reloadLayoutMap(x));
        }
    }

    loadOccupancyForPlate() {
        console.log(this.destinationFreezerPlate)
        this.containersService
            .getOccupancy(this.destinationFreezerPlate
            && this.destinationFreezerPlate.containerID)
            .subscribe(result => {
                if (result.occupiedPositions != "")
                    this.layoutMapForRack.filledItemsCoordinates = result.occupiedPositions;
            })
    }

    reloadLayoutMap(coordinates = '') {
        // occupiedPositions implemented in a such way, because it's a type of any
        this.layoutMapForRack.filledItemsCoordinates = coordinates['occupiedPositions'];
    }

    private cleanLayoutMap() {
        this.layoutMapForRack.filledItemsCoordinates = '';
    }
}
