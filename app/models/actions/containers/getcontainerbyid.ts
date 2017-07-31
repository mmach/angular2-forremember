import { BaseAction } from "../baseAction";
export class GetContainerByIdAction extends BaseAction {
    public Action: string = "GetContainerAction";
    public model: any;

    constructor(public containerId: number) {
        super();
        this.model = {ContainerId: containerId };
    }
}
