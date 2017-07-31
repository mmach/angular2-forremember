import { IConcept } from "../../models/concept";
import { IConceptType } from "../../models/conceptType";

export class ConceptEditValidation {

	public forms;
	public messages;
	public disabilities;

    constructor(forms, messages, disabilities) {

			this.forms = forms;
			this.messages = messages;
			this.disabilities = disabilities;

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

	public validate() {

		if(this.forms.conceptId == null || this.forms.conceptId == undefined) {
			this.messages.conceptId = "Field is required.";
		}
		else if(this.forms.conceptId.toString().length == 0) {
			this.messages.conceptId = "Field is required.";
		}
		else {
			if(this.forms.conceptId.toString().length < 6) {
				this.messages.conceptId = "Field must be at least 6 digits long.";
			}
			else {
				this.messages.conceptId = null;
			}
		}

		if(this.forms.type.conceptTypeID != 1 &&  this.forms.type.conceptTypeID != 2 && this.forms.type.conceptTypeID != 3) {
			this.messages.type = "Field is required.";
		}
		else {
			this.messages.type = null;
		}

		if(this.forms.sequence == null || this.forms.sequence == undefined) {
			this.messages.sequence = "Field is required.";
		}
		else if(this.forms.sequence.toString().length == 0) {
			this.messages.sequence = "Field is required.";
		}
		else {

			if(((this.forms.type.conceptTypeID == 1) && !(new RegExp("^[AUCG]+$")).test(this.forms.sequence)) ||
				((this.forms.type.conceptTypeID == 2) && !(new RegExp("^[ARNDCEQGHILKMFPSTWYV]+$")).test(this.forms.sequence)) ||
				((this.forms.type.conceptTypeID == 3) && !(new RegExp("^[ATCG]+$")).test(this.forms.sequence))) {
					//rna, protein, dna
					this.messages.sequence = "Sequence contains forbidden characters";
			}
			else {
				this.messages.sequence = null;
			}
		}
	}

	public isValid(): boolean {
		return (this.messages.conceptId == null && this.messages.type == null && this.messages.sequence == null);
	}

	public disable(b: boolean) {
		this.disabilities.conceptId = b;
		this.disabilities.type = b;
		this.disabilities.sequence = b;
	}
}
