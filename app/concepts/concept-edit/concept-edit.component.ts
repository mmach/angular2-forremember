import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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

@Component({
    templateUrl: 'concept-edit.component.html',
    styleUrls: ['concept-edit.component.css', '../../CustomStyles/AddEditItem.css'],
    providers: [ValidatorService]
})
export class ConceptEditComponent implements OnInit, AfterViewInit {
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
        private route: ActivatedRoute,
        private validatorService: ValidatorService) {
        this.concept = new IConcept();
        this.customProperties = new Array<ICustomProperty>();
    }

    ngOnInit() {
        this.route.params.subscribe(params => this.onRouteActivated(params));
        this.conceptTypesService.getConceptTypes()
            .subscribe(
            conceptTypes => {
                this.conceptTypes = conceptTypes;
            },
            error => this.useMockConceptTypes());
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.customPropertiesComponent.setCustomProperties(this.customProperties);
            this.customPropertiesComponent.setReadonly(false);
        }, 10);
    }

    public onRouteActivated(params) {
        let conceptId = params['id'];
        this.conceptTypesService.getConceptTypes()
            .subscribe(
            conceptTypes => {
                this.conceptTypes = conceptTypes;
                this.conceptsService.getConceptByID(conceptId)
                    .subscribe(concept => {
                        this.concept = concept;

                        this.sequenceEditor.sequenceType = this.covertConcepTypeIdToSequenceTypeEnum(this.concept.conceptTypeID);
                        this.sequenceEditor.value = this.concept.conceptText;
                    });
            });

        this.customPropertiesService
            .getAllProperties(conceptId)
            .subscribe(prop => { this.setCustomProperties(prop); });
    }

    covertConcepTypeIdToSequenceTypeEnum(conceptTypeID): SequenceTypeEnum {
        let sequenceType = SequenceTypeEnum.Undefined;
        if (conceptTypeID === ConceptTypeEnum.RNA) {
            sequenceType = SequenceTypeEnum.RNA;
        }
        else if (conceptTypeID === ConceptTypeEnum.Protein) {
            sequenceType = SequenceTypeEnum.Protein;
        }
        else if (conceptTypeID === ConceptTypeEnum.DNA) {
            sequenceType = SequenceTypeEnum.DNA;
        }
        return sequenceType;
    }

    onEditConceptButton() {
        if (this.validatorService.validate()) {
            this.conceptsService.validatorService = this.validatorService;

            this.concept.conceptText = this.sequenceEditor.value;

            this.conceptsService.updateConcept(this.concept).subscribe(result => {
                if (result.errorCode === 0) {
                    this.saveCustomProperties();
                    this.router.navigateByUrl('concepts');
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
        if (event === ConceptTypeEnum.RNA) {
            this.sequenceEditor.sequenceType = SequenceTypeEnum.RNA;
        }
        else if (event === ConceptTypeEnum.Protein) {
            this.sequenceEditor.sequenceType = SequenceTypeEnum.Protein;
        }
        else if (event === ConceptTypeEnum.DNA) {
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
