export abstract class Location {
    locationId: number;
    name: string;
    olc: number;
    
    parent: Location;
    fullPath: string;

    abstract getNodeType(): string;
    abstract children(): Array<Location>;
    abstract selectEventType(): number;
    abstract addEventType(): number;

    public getPath(): Array<number> {
        let set = new Array<number>();
        let loc: Location = this;
        while(loc) {
            set.push(loc.locationId);
            loc = loc.parent;
        }
        return set;
    }
}
