import { BaseAction } from "./baseAction";

export class GetAdditonalLocationInfoEditAction extends BaseAction {
    public Action: string = "GetAdditonalLocationInfoEditAction";
    private model: any;

    constructor(id: number) {
        super();

        this.model = {
            id: id
        };
    }
}