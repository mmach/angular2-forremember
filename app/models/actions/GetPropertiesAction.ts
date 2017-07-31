import { BaseAction } from "./baseAction";
import { IConcept } from "../concept";

export class GetPropertiesAction extends BaseAction {
    public Action: string = "GetPropertiesAction";
    public model: any = {};

    constructor(public id: any) {
        super();

        this.model.parentID = id;
    }
}