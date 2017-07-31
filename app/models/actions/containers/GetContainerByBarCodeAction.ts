import { BaseAction } from '../baseAction';

export class GetContainerByBarCodeAction extends BaseAction {
    public Action: string = 'GetContainerByBarCodeAction';
    public model: any;

    constructor(containerBarCode: string) {
        super();
        this.model =  containerBarCode;
    }
}
