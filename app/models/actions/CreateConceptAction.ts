import { BaseAction } from "./baseAction";
import { IConcept } from "../concept";

export class CreateConceptAction extends BaseAction {
    public Action: string = "CreateConceptAction";
    private model: any;

    constructor(model: IConcept) {
        super();

        this.model = {
            name: model.name,
            conceptTypeID: model.conceptTypeID,
            conceptText: model.conceptText
        };
    }
}