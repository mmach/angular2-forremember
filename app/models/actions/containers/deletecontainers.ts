import { BaseAction } from "../baseAction";
import { IContainer } from "../../container";

export class DeleteContainerWithReasonAction extends BaseAction {
    public Action: string = "DeleteContainerWithReasonAction";
    constructor(public model: IContainer) {
        super();
    }
}