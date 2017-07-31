import { IContainer } from "../../container";
import { BaseAction } from "../baseAction";
export class UpdateContainerAction extends BaseAction {
    public Action: string = "UpdateContainerAction";
    constructor(public model: IContainer) {
        super();
    }
}