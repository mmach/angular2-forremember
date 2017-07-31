import { BaseAction } from '../baseAction';

export class GetFreezerRacksAction extends BaseAction {
    public Action: string = 'GetFreezerRacksAction';
    public model: any = {};

    constructor(freezerID: number) {
        super();
        this.model.freezerID = freezerID;
    }
}
