import { BaseAction } from "./baseAction";
import { ICustomProperty } from "../customproperty";

export class UpdatePropertyAction extends BaseAction {
    public Action: string = "UpdatePropertyAction";

    constructor(public model: ICustomProperty) {
        super();
    }
}