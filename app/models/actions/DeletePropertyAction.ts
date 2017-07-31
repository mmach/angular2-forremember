import { BaseAction } from "./baseAction";
import { ICustomProperty } from "../customproperty";

export class DeletePropertyAction extends BaseAction {
    public Action: string = "DeletePropertyAction";
    public model: ICustomProperty = new ICustomProperty();

    constructor(public propertyID: number) {
        super();
        this.model.propertyID = propertyID
    }
}