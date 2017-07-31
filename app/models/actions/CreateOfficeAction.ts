import { BaseAction } from "./baseAction";
import { ILocation } from "../location";

export class CreateOfficeAction extends BaseAction {
    public Action: string = "CreateOfficeAction";
    public model: any;

    constructor(model: ILocation) {
        super();
        this.model = {
            parentLocationId: model.parentLocationID,
            name: model.name,
            address: model.address
        };
    }
}