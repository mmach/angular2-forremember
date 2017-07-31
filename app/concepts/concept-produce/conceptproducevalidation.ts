import { IConcept } from "../../models/concept";
import { IConceptType } from "../../models/conceptType";
import { ContainersService } from "../../services/containers.service";

export class ConceptProduceValidation {
	public forms;
	public messages;
	public disabilities;
	private containersService:ContainersService
	private fieldIsRequired = "Field is required";
    constructor(forms, messages, disabilities, containersService: ContainersService) {

			this.forms = forms;
			this.messages = messages;
			this.disabilities = disabilities;
			this.containersService = containersService;

			this.forms.conceptId = '';
//			this.forms.selectedContainerType = '';
			this.forms.targetContainerBarcode = '';
			this.forms.targetRackBarcode = 'rc';
			this.forms.amount = undefined;
			this.forms.purity = undefined;
			this.forms.productionDate = '';
			this.forms.expirationDate = '';
			this.forms.targetFreezer = '';

			this.forms.conceptId = "";
			this.forms.type = "";
			this.forms.sequence = "";

			this.messages.conceptId = null;
			this.messages.type = null;
			this.messages.sequence = null;

			this.disabilities.conceptId = false;
			this.disabilities.type = false;
			this.disabilities.sequence = false;
    }

	private ClearAllErrors(){
		this.messages.amount = null;
		this.messages.selectedContainerType = null;
		this.messages.targetContainerBarcode = null;
		this.messages.purity = null;
		this.messages.targetFreezer = null;
		this.messages.expirationDate = null;
	}

	public validate() {
		this.ClearAllErrors();

		if(this.forms.amount == null)
			this.messages.amount = this.fieldIsRequired;

		if(this.forms.purity == null)
			this.messages.purity = this.fieldIsRequired;

		if (!this.forms.selectedContainerType)
			this.messages.selectedContainerType = this.fieldIsRequired;

		if (!this.forms.targetContainerBarcode) {
			this.messages.targetContainerBarcode = this.fieldIsRequired;
		} 
		
		if (!this.forms.targetFreezer)
			this.messages.targetFreezer = this.fieldIsRequired;

		if (!this.forms.expirationDate)
			this.messages.expirationDate = this.fieldIsRequired;
	}

	public updateMessages(messages) {
		if(messages.hasOwnProperty("ContainerID"))
			this.messages.targetContainerBarcode = messages.ContainerID;
		else
			this.messages.targetContainerBarcode = null;

		if(messages.hasOwnProperty("ParentContainerID"))
			this.messages.targetRackBarcode = messages.ParentContainerID;
		else
			this.messages.targetRackBarcode = null;

		if(messages.hasOwnProperty("Position"))
			this.messages.position = messages.Position;
		else
			this.messages.position = null;

		if(messages.hasOwnProperty("FreezerID"))
			this.messages.targetFreezer = messages.FreezerID;
		else
			this.messages.targetFreezer = null;

		if(messages.hasOwnProperty("Amount"))
			this.messages.amount = messages.Amount;
		else
			this.messages.amount = null;

		if(messages.hasOwnProperty("Purity"))
			this.messages.purity = messages.Purity;
		else
			this.messages.purity = null;
	}

	public isValid(): boolean {
		return (this.messages.amount == null &&
			this.messages.selectedContainerType == null &&
			this.messages.targetContainerBarcode == null &&
			this.messages.purity == null &&
			this.messages.targetFreezer == null &&
			this.messages.expirationDate == null)
	}

	public disable(b: boolean) {
		//this.disabilities.conceptId = b;
		//this.disabilities.type = b;

		//this.disabilities.amount = b;
		//this.disabilities.selectedContainerType = b;
		//this.disabilities.targetContainerBarcode = b;
		//this.disabilities.purity = b;
		//this.disabilities.targetFreezer = b;
		//this.disabilities.expirationDate = b;
	}
}
