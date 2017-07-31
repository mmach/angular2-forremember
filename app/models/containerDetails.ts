import { IContainer } from "./container";

export class ContainerDetails extends IContainer {
    public expirationDate: any;
    public isExpired: boolean;

    constructor(json) {
        super(json);
    }
}
