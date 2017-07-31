import { ViewChildren, Component, OnInit, EventEmitter, Input } from '@angular/core';

import { ICustomProperty } from "../models/customproperty"
import { CustomPropertiesService } from "../services/customproperties.service"

import { ValidationModel } from '../customComponents/validation/validation-model.directive';
import { ValidatorService } from '../services/validator.service';

@Component({
    selector: 'custom-properties',
    templateUrl: "customproperties.component.html",
    styleUrls: ["customproperties.component.css"],
    providers: [ValidatorService]
})
export class CustomPropertiesComponent implements OnInit {
    @Input() allCustomProperties: ICustomProperty[];
    customProperties: ICustomProperty[];
    private readonly: boolean = true;

    constructor(
        public customPropertiesService: CustomPropertiesService,
        private validatorService: ValidatorService) {
    }

    ngOnInit() {

    }

    setCustomProperties(properties: ICustomProperty[]) {
        this.allCustomProperties = properties;
        this.refresh();
    }

    public setReadonly(readonly: boolean) {
        this.readonly = readonly;
    }

    protected addProperty() {
        let newProperty = new ICustomProperty();
        newProperty.isDeleted = false;
        this.allCustomProperties.push(newProperty);
        this.refresh();
    }

    protected deleteProperty(customProperty: ICustomProperty) {
        customProperty.isDeleted = true;
        this.refresh();
    }

    private refresh() {
        if (this.allCustomProperties != null) {
            this.customProperties = this.allCustomProperties.filter(p => !p.isDeleted);
        }
    }

    validate() {
        return this.validatorService.validate();
    }

    saveProperties(parentID: number) {
        if (this.validatorService.validate()) {
            this.customPropertiesService.saveProperties(this.allCustomProperties);
        }
    }
}
