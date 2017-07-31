import { BaseAction } from '../baseAction';

export class GetContainerOccupancyAction extends BaseAction {
    public Action: string = 'GetContainerOccupancyAction';
    public model: any;

    constructor(public containerId: number) {
        super();
        this.model = {ContainerId: containerId };
    }
}
