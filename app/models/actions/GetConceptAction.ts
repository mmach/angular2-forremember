import { BaseAction } from "./baseAction";
import { IConcept } from "../concept";
export class GetConceptAction extends BaseAction {
    public Action: string = "GetConceptAction";
    public model: any;

    constructor(public id: number) {
        super();
        this.model = {
            conceptID: id
        };
    }
}