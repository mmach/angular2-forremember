import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/Rx';

import { IFreezer } from '../models/freezer';
import { BaseService } from '../services/base.service';

import { GetFreezersAction, UpdateFreezerAction, CreateFreezerAction,
    GetFreezerAction, GetFreezersWithFreeSpace, GetFreezersWithFreeSpaceByContainerId,
    GetFreezersByLocationAction } from '../models/actions';

@Injectable()
export class FreezersService extends BaseService
{
    constructor(public http: Http) {
        super(http);
    }

    getFreezers(): Observable<IFreezer[]> {
        return this.query(new GetFreezersAction());
    }

    insertFreezer(freezer: IFreezer): Observable<any> {
        return this.command(new CreateFreezerAction(freezer));
    }

    updateFreezer(freezer: IFreezer): Observable<any> {
        return this.command(new UpdateFreezerAction(freezer));
    }

    getShortFreezerData(id: string): Observable<IFreezer[]> {
        return this.query(new GetFreezersWithFreeSpace(parseInt(id)));
    }

    getShortFreezerDataByContainerId(containerId: number): Observable<any> {
        return this.query(new GetFreezersWithFreeSpaceByContainerId(containerId));
    }

    getFreezer(id: number): Observable<IFreezer> {
        return this.query(new GetFreezerAction(id));
    }

    getFreezersByLocation(locationId: number): Observable<IFreezer[]> {
        return this.query(new GetFreezersByLocationAction(locationId));
    }

    deleteFreezerById(freezerID) {
    }
}
