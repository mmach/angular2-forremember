import { BaseAction } from "./baseAction";
import { IConcept } from "../concept";

export class RegisterConceptAction extends BaseAction {
    public Action: string = "RegisterConceptAction";

    constructor(public model: IConcept) {
        super();
    }
}