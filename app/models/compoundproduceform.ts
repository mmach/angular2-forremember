export class CompoundProduceForm {
	Name: string;
    ContainerBarcode: string;
    ParentContainerBarcode: string;
    FreezerId: number;
    Amount: number;
    Position: string;
    Purity: number;
    ProductionDate: string;
    ExpirationDate: string;
    UserId: number;
    IgnoreFreezerCapacity: boolean;
}

export class ISplitCompund extends CompoundProduceForm {
    ContainerId: number;
}