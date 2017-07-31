import { BaseAction } from "./baseAction";
import { ILocation } from "../location";

export class UpdateOfficeAction extends BaseAction {
    public Action: string = "UpdateOfficeAction";
    private model: any;

    constructor(location: ILocation) {
        super();
        this.model = {
            id: location.id,
            name: location.name,
            address: location.address,
            olc: location.olc
        };
    }
}