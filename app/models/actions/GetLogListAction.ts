import { BaseAction } from "./baseAction";

export class GetLogListAction extends BaseAction {
    public Action: string = "GetLogList";
    public model: any;

    constructor(public path: string) {
        super();
        this.model = path ;
    }
}