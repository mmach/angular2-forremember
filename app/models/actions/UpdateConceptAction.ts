import { BaseAction } from "./baseAction";
import { IConcept } from "../concept";

export class UpdateConceptAction extends BaseAction {
    public Action: string = "UpdateConceptAction";
    private model: any;

    constructor(model: IConcept) {
        super();

        this.model = {
            conceptID: model.conceptID,
            name: model.name,
            conceptTypeID: model.conceptTypeID,
            conceptText: model.conceptText,
            registered: model.registered,
            olc: model.olc
        };
    }
}