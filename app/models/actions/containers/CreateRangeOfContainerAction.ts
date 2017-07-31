import { BaseAction } from "../baseAction";
import { IContainersRange } from "../../ContainersRange";

export class CreateRangeOfContainerAction extends BaseAction {
    public Action: string = "CreateRangeOfContainerAction";
    constructor(public model: IContainersRange) {
        super();
    }
}