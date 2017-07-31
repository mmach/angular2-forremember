import { BaseAction } from "./baseAction";
export class GetFreezersWithFreeSpace extends BaseAction {
    public Action: string = "GetFreezersWithFreeSpaceAction";
    public model: any;

    constructor(public freezerID: number) {
        super();
        this.model = {Id: freezerID };
    }

}