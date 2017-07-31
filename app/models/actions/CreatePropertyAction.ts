import { BaseAction } from "./baseAction";
import { ICustomProperty } from "../customproperty";

export class CreatePropertyAction extends BaseAction {
    public Action: string = "CreatePropertyAction";

    constructor(public model: ICustomProperty) {
        super();
    }
}