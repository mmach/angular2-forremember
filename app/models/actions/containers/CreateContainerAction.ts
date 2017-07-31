import { BaseAction } from "../baseAction";
import { IContainer } from "../../Container";

export class CreateContainerAction extends BaseAction {
    public Action: string = "CreateContainerAction";
    private model: any;

    constructor(container: IContainer) {
        super();

        this.model = {
            barCode: container.barCode,
            containerType: container.containerType
        };
    }
}