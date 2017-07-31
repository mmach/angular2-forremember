import { BaseAction } from '../baseAction';
import { IContainer } from '../../Container';
import { IFreezer } from '../../freezer';

export class PutInFreezerAction extends BaseAction {
    public Action: string = 'PutInFreezerAction';
    public model: any;

    constructor(container: IContainer, freezer: IFreezer, parentContainerID: number, position: string) {
        super();

        this.model = { freezerID: freezer.freezerID, container, parentContainerID, position };
    }
}