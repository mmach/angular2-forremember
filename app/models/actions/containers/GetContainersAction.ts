import { BaseAction } from "../baseAction";
import { PagedSearch } from "../../container-page-wrapper";

export class GetContainersAction extends BaseAction {
    public Action: string = "GetContainersAction";

    constructor(public model: PagedSearch) {
        super();
    }
}