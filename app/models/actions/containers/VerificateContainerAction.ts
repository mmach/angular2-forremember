import { BaseAction } from "../baseAction";
import { IContainer } from "../../Container";

export class VerificateContainerAction extends BaseAction {
    public Action: string = "VerificateContainerAction";
    constructor(public model: IContainer) {
        super();
    }
}
