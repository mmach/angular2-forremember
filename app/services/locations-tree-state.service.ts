import { Injectable } from '@angular/core';

class LocationPath {
    constructor(
        public locationPath: Array<number>,
        public freezerID: number = 0) {
    }

    isCurrentPath(nodeID: number): boolean {
        return this.locationPath.indexOf(nodeID) >= 0;
    }

    bottomNode(): number {
        return this.locationPath[0];
    }

    addLocationToPath(ids:Array<number>) {
        for(let id of ids) {
            if(this.locationPath.indexOf(id) < 0)
                //add to start of array for bottomNode method
                this.locationPath.unshift(id);
        }
    }

    isCurrentNode(nodeID: number) {
         return this.bottomNode() === nodeID && this.freezerID === 0;
    }
}

export class LocationsTreeStateService {
    static expandedNodes: Set<number> = new Set<number>();
    static selectedPath: LocationPath = new LocationPath(new Array<number>());

    static setSelectedPath(path: Array<number>, nodeType: string, nodeData: any, isExpanded: boolean) {
        let locationPath = new LocationPath(path);
        LocationsTreeStateService.selectedPath = locationPath;
        LocationsTreeStateService.setExpandedNode(locationPath.bottomNode(), isExpanded);
    }

    static setFreezerSelectedPath(path: Array<number>, nodeType: string, nodeData: any, freezerID: number) {
        LocationsTreeStateService.selectedPath = new LocationPath(path, freezerID);
    }

    static isNodeExpanded(nodeID: number): boolean {
        return LocationsTreeStateService.expandedNodes.has(nodeID);
    }

    static isCurrentPath(nodeID: number): boolean {
        return LocationsTreeStateService.selectedPath.isCurrentPath(nodeID);
    }

    static isCurrentNode(nodeID: number): boolean {
        return LocationsTreeStateService.selectedPath.isCurrentNode(nodeID);
    }

    static isCurrentFreezer(freezerID: number): boolean {
        return LocationsTreeStateService.selectedPath.freezerID === freezerID;
    }

    static addLocationToPath(...ids:Array<number>) {
        for(let id of ids) 
            this.expandedNodes.add(id);
        
        LocationsTreeStateService.selectedPath.addLocationToPath(ids);
    }

    static setFrezeer(freezerID) {
        LocationsTreeStateService.selectedPath.freezerID = freezerID;
    }

    private static setExpandedNode(nodeID: number, isExpanded: boolean) {
        if(isExpanded)
            LocationsTreeStateService.expandedNodes.add(nodeID);
        else
            LocationsTreeStateService.expandedNodes.delete(nodeID);
    }
}

