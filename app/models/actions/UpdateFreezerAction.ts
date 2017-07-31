import { BaseAction } from "./baseAction";
import { IFreezer } from "../freezer";

export class UpdateFreezerAction extends BaseAction {
    public Action: string = "UpdateFreezerAction";

    constructor(public model: IFreezer) {
        super();
    }
}