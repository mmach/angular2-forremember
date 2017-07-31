import { BaseAction } from "./baseAction";

export class GetLocationAction extends BaseAction {
    public Action: string = "GetLocationAction";
    private model: any;

    constructor(id: number) {
        super();

        this.model = {
            id: id
        };
    }
}