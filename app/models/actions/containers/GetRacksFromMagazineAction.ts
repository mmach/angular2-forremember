import { BaseAction } from '../baseAction';
import { PagedSearch } from '../../container-page-wrapper';

export class GetRacksFromMagazineAction extends BaseAction {
    public Action: string = 'GetRacksFromMagazineAction';

    constructor(public model: PagedSearch) {
        super();
    }
}
