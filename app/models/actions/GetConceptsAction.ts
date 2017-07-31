import { BaseAction } from "./baseAction";
import { PagedSearch } from "../container-page-wrapper";

export class GetConceptsAction extends BaseAction {
    public Action: string = "GetConceptsAction";

    constructor(public model: PagedSearch) {
        super();
    }
}