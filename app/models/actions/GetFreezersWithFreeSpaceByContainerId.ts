import { BaseAction } from "./baseAction";

export class GetFreezersWithFreeSpaceByContainerId extends BaseAction {
    public Action: string = "GetFreezersWithFreeSpaceByContainerIdAction";
    public model: any;
    
    constructor(public containerId: number) {
        super();
        this.model = { Id: containerId };
    }

}