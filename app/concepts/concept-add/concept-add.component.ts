import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { IConcept } from '../../models/concept';
import { ConceptTypeEnum } from '../../models/ConceptTypeEnum';
import { IConceptType } from '../../models/conceptType';

import { SequenceEditor, SequenceTypeEnum } from '../../customComponents/sequenceEditor/sequenceEditor.component';

import { ConceptsService } from '../../services/concepts.service';
import { ConceptTypesService } from '../../services/conceptTypes.service';
import { CustomPropertiesComponent } from '../../CustomProperties/customProperties.component';
import { CustomPropertiesService } from '../../services/customproperties.service';
import { ICustomProperty } from '../../models/customproperty';

import { ValidationModel } from '../../customComponents/validation/validation-model.directive';
import { ValidatorService } from '../../services/validator.service';

import { GlobalVars } from '../../global-vars';

@Component({
    templateUrl: 'concept-add.component.html',
    styleUrls: ['concept-add.component.css', '../../CustomStyles/AddEditItem.css'],
    providers: [ValidatorService]
})
export class ConceptAddComponent implements AfterViewInit {
    @ViewChild(CustomPropertiesComponent)
    protected customPropertiesComponent: CustomPropertiesComponent;

    @ViewChild(SequenceEditor)
    sequenceEditor: SequenceEditor;

    public customProperties: ICustomProperty[];
    public conceptTypes: IConceptType[];
    public concept: IConcept;

    constructor(
        protected conceptsService: ConceptsService,
        protected conceptTypesService: ConceptTypesService,
        protected customPropertiesService: CustomPropertiesService,
        public router: Router,
        private globalVariableObject: GlobalVars,

        private validatorService: ValidatorService) {
        this.concept = new IConcept();
        this.conceptTypesService.getConceptTypes()
            .subscribe(conceptTypes => {
                this.conceptTypes = conceptTypes;
            },
            error => this.useMockConceptTypes());

        this.conceptsService.query({
            "Action": "GetUniqConceptNameAction"
        }).subscribe(name => {
            this.concept.name = name;
        });
 
        this.customProperties = new Array<ICustomProperty>();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.customPropertiesComponent.setCustomProperties(this.customProperties);
            this.customPropertiesComponent.setReadonly(false);
        }, 10);
    }

    onAddConceptButton() {
        if (this.validatorService.validate()) {
            this.conceptsService.validatorService = this.validatorService;

            this.concept.conceptText = this.sequenceEditor.value;

            this.conceptsService.createConcept(this.concept).subscribe(result => {
                if (result.errorCode == 0) {
                    this.concept.conceptID = result.NewID;
                    this.saveCustomProperties();
                    this.router.navigateByUrl('concepts');

                    this.globalVariableObject.lastNavigatedFromAction = "CreateConceptSuccess";
                }
            });
        }
    }

    public setCustomProperties(customProperties) {
        this.customProperties = customProperties;
        this.customPropertiesComponent.setCustomProperties(this.customProperties);
    }

    protected saveCustomProperties() {
        this.customProperties.filter(p => !p.isDeleted).forEach(p => p.parentID = this.concept.conceptID);
        this.customPropertiesService.saveProperties(this.customProperties);
    }

    cancel() {
        this.validatorService.clearGlobalMessage();
        this.router.navigateByUrl('concepts');
    }

    useMockConceptTypes() {
        let rna = new IConceptType();
        rna.conceptTypeID = 1;
        rna.name = 'RNA';
        let protein = new IConceptType();
        protein.conceptTypeID = 2;
        protein.name = 'Protein';
        let dna = new IConceptType();
        dna.conceptTypeID = 3;
        dna.name = 'DNA';
        this.conceptTypes = new Array<IConceptType>();
        this.conceptTypes.push(rna);
        this.conceptTypes.push(protein);
        this.conceptTypes.push(dna);
    }

    onConceptTypeChange(event) {
        if (event == ConceptTypeEnum.RNA) {
            this.sequenceEditor.sequenceType = SequenceTypeEnum.RNA;
        }
        else if (event == ConceptTypeEnum.Protein) {
            this.sequenceEditor.sequenceType = SequenceTypeEnum.Protein;
        }
        else if (event == ConceptTypeEnum.DNA) {
            this.sequenceEditor.sequenceType = SequenceTypeEnum.DNA;
        }
        this.sequenceEditor.validate();
    }

    validateSequence(valModel: ValidationModel) {
        return this.sequenceEditor.validate();
    }

    validateCustomProperties(valModel: ValidationModel) {
        return this.customPropertiesComponent.validate();
    }
}
