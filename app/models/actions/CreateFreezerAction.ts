import { BaseAction } from "./baseAction";
import { IFreezer } from "../freezer";

export class CreateFreezerAction extends BaseAction {
    public Action: string = "CreateFreezerAction";

    constructor(public model: IFreezer) {
        super();
    }
}