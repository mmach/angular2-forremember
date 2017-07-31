import { BaseAction } from '../baseAction';
import { PagedSearch } from '../../container-page-wrapper';

export class GetContainersInMagazineOrRackAction extends BaseAction {
    public Action: string = 'GetContainersInMagazineOrRackAction';

    constructor(public model: PagedSearch) {
        super();
    }
}
