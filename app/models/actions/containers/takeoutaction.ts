import { BaseAction } from "../baseAction";
import { IContainer } from "../../Container";

export class TakeOutAction extends BaseAction {
    public Action: string = "TakeOutAction";
    constructor(public model: IContainer) {
        super();
    }
}