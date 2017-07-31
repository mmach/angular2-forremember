import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

import { BaseService } from "../services/base.service";

import { GetContainersAction } from "../models/actions/containers/GetContainersAction";
import { CreateContainerAction } from "../models/actions/containers/CreateContainerAction";
import { VerificateContainerAction } from "../models/actions/containers/VerificateContainerAction";
import { CreateRangeOfContainerAction } from "../models/actions/containers/CreateRangeOfContainerAction";
import { GetContainerByIdAction } from "../models/actions/containers/getcontainerbyid";
import { MoveContainerAction } from "../models/actions/containers/movecontainers";
import { DeleteContainerWithReasonAction } from "../models/actions/containers/deletecontainers";
import { ConsumeFromContainerAction } from "../models/actions/containers/ConsumeFromContainerAction";
import { TakeOutAction } from "../models/actions/containers/takeoutAction";
import { PutInFreezerAction } from "../models/actions/containers/PutInFreezerAction";
import { InitializeElasticSearchContainersAction } from "../models/actions/containers/InitializeElasticSearchContainersAction";
import { DoesContainerExistAndInMagazineAction } from "../models/actions/containers/DoesContainerExistAndInMagazineAction";
import { GetFreezerRacksAction } from "../models/actions/containers/GetFreezerRacksAction";
import { GetFreezerPlatesAction } from "../models/actions/containers/GetFreezerPlatesAction";
import { GetContainerOccupancyAction } from "../models/actions/containers/GetContainerOccupancyAction";
import { GetContainerByBarCodeAction } from "../models/actions/containers/GetContainerByBarCodeAction";
import { IContainer } from "../models/container";
import { PagedSearch, ContainerPageWrapper } from "../models/container-page-wrapper";

import { IContainersRange } from "../models/containersRange";
import { environment } from "../environment";
import { IFreezer } from "../models/freezer";
import { MoveContainer } from "../models/movecontainer";

@Injectable()
export class ContainersService extends BaseService {

    constructor(public http: Http) {
        super(http);
    }

    getContainersWithPages(pagedSearch: PagedSearch): Observable<ContainerPageWrapper> {
        return this.query(new GetContainersAction(pagedSearch));
    }

    createContainer(container: IContainer): Observable<any> {
        return this.command(new CreateContainerAction(container));
    }

    verificateContainer(container: IContainer): Observable<any> {
        return this.command(new VerificateContainerAction(container));
    }

    createContainersRange(containersRange: IContainersRange): Observable<any> {
        return this.command(new CreateRangeOfContainerAction(containersRange));
    }

    ///
    /// retrieve the list of containers with the whole rage of information as containerId, related freezer, locaiton, and so on.
    ///
    getDataToMoveContainer(id: number): Observable<IContainer> {
        return this.query(new GetContainerByIdAction(id));
        /*

        return this.http.get(environment.apiUrl + "/GetContainerById/" + id)
            .map((r) => r.json())
            .catch(this.handleError);*/
    }

    MoveContainer(movingContainer: MoveContainer): Observable<any> {
        return this.command(new MoveContainerAction(movingContainer));

        /*         let headers = new Headers({ 'Content-Type': 'application/json' });
                 let options = new RequestOptions({ headers: headers });
        
                 return this.http.post(environment.apiUrl + "/MoveContainer", JSON.stringify(movingContainer), options)
                     .map((r) => r.json())
                     .do(data => console.log('All: ' + JSON.stringify(data)))
                     .catch(this.handleError);*/
    }

    ConsumeFromContainer(updatingContainer: IContainer): Observable<any> {
         return this.command(new ConsumeFromContainerAction(updatingContainer));
    }

    DeleteContainer(deletingContainer: IContainer): Observable<any> {
        return this.command(new DeleteContainerWithReasonAction(deletingContainer));
    }

    takeOut(container: IContainer): Observable<any> {
        return this.command(new TakeOutAction(container));
    }

    putInFreezer(container: IContainer, freezer: IFreezer, parentContainerID: number, position: string): Observable<any> {
        return this.command(new PutInFreezerAction(container, freezer, parentContainerID, position));
    }

    getFreezerRacks(freezerID: number): Observable<IContainer[]> {
        return this.query(new GetFreezerRacksAction(freezerID))
    }

    getFreezerPlates(freezerID: number): Observable<IContainer[]> {
        return this.query(new GetFreezerPlatesAction(freezerID))
    }

    getOccupancy(containerID: number): Observable<any> {
        return this.query(new GetContainerOccupancyAction(containerID));
    }

    GetContainerByBarCode1(containerBarCode: string): Observable<number> {
        return this.query(new GetContainerByBarCodeAction(containerBarCode));
    }

    public getContainerByBarcode(barcode: string): Observable<IContainer> {
        return this.http.get(environment.apiUrl + "/getContainerByBarcode/" + barcode)
            .map(r => r.json())
            .catch(this.handleError);
    }

    public InitializeElasticSearch(): Observable<any> {
        return this.command(new InitializeElasticSearchContainersAction());
    }

    public DoesContainerExistAndInMagazine(barcode: string): Observable<boolean> {
        return this.query(new DoesContainerExistAndInMagazineAction(barcode));
    }
}
