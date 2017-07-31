import { BaseAction } from '../baseAction';

export class GetFreezerPlatesAction extends BaseAction {
    public Action: string = 'GetFreezerPlatesAction';
    public model: any = {};

    constructor(freezerID: number) {
        super();
        this.model.freezerID = freezerID;
    }
}
