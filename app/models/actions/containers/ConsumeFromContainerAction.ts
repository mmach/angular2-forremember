import { IContainer } from "../../container";
import { BaseAction } from "../baseAction";
export class ConsumeFromContainerAction extends BaseAction {
    public Action: string = "ConsumeFromContainerAction";
    private model: any;

    constructor(container: IContainer) {
        super();

        this.model = {
            barCode: container.barCode,
            amount: container.amount,
            reason: container.reason
        };
    }
}