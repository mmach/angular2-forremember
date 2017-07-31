import { BaseAction } from './baseAction';

export class GetFreezerAction extends BaseAction {
    public Action: string = 'GetFreezerAction';
    public model: any;

    constructor(public freezerID: number) {
        super();

        this.model = { id: freezerID };
    }
}
