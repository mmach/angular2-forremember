import { BaseAction } from "../baseAction";
export class DoesContainerExistAndInMagazineAction extends BaseAction {
    public Action: string = "DoesContainerExistAndInMagazineAction";
    public model: any;

    constructor(public barcode: string) {
        super();
        this.model = {BarCode: barcode};
    }
}
