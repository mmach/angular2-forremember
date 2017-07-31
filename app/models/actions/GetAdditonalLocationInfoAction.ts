import { BaseAction } from "./baseAction";

export class GetAdditonalLocationInfoAction extends BaseAction {
    public Action: string = "GetAdditonalLocationInfoAction";
    private model: any;

    constructor(id: number) {
        super();

        this.model = {
            id: id
        };
    }
}