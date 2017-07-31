import { BaseAction } from "./baseAction";
import { ILocation } from "../location";

export class CreateCityAction extends BaseAction {
    public Action: string = "CreateCityAction";
    public model: any;
    
    constructor(model: ILocation) {
        super();
        this.model = {
            parentLocationId: model.parentLocationID,
            name: model.name         
        };
    }
}