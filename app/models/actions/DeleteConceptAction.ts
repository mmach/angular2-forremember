import { BaseAction } from "./baseAction";
import { IConcept } from "../concept";

export class DeleteConceptAction extends BaseAction {
    public Action: string = "DeleteConceptAction";
    public model: any;

    constructor(public conceptId: number) {
        super();
        this.model = {ConceptId: conceptId };        
    }
}