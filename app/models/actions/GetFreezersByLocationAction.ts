import { BaseAction } from "./baseAction";

export class GetFreezersByLocationAction extends BaseAction {
    public Action: string = "GetFreezersByLocationAction";
    public model: any;

    constructor(public locationId: number) {
        super();
        this.model = locationId;
    }

}