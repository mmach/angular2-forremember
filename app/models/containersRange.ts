import { IContainerType } from "../models/containerType";

export class IContainersRange {
    freezerID: number;
    containerTypeID: number;
    startBarCode: string;
    endBarCode: string;
    maxCapacity: number;    
    deadVolume: number;
    compoundID: number;
    amount: number;
    userID: number;

    containerType: IContainerType;
}
