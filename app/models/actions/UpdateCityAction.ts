import { BaseAction } from "./baseAction";
import { ILocation } from "../location";

export class UpdateCityAction extends BaseAction {
    public Action: string = "UpdateCityAction";
    private model: any;

    constructor(location: ILocation) {
        super();
        this.model = {
            id: location.id,
            name: location.name,
            olc: location.olc
        };
    }
}