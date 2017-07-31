import { IConceptType } from './concepttype'
export class IConcept {
    public conceptID: number;
    public name: string;
    public conceptText: string;
    public registered: boolean;
    public conceptTypeID: number;
    public registeredBy: number;
    public registerTime: Date;
    public olc: number;
}