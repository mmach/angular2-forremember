import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

export class BroadcastEventType
{
	static TREEVIEW_SELECT_COUNTRY:number = 0;
	static TREEVIEW_SELECT_CITY:number = 1;
	static TREEVIEW_SELECT_OFFICE:number = 2;
	static TREEVIEW_SELECT_FREEZER:number = 3;

	static TREEVIEW_ADD_COUNTRY:number = 4;
	static TREEVIEW_ADD_CITY:number = 5;
	static TREEVIEW_ADD_OFFICE:number = 6;
	static TREEVIEW_ADD_FREEZER:number = 7;
	static TREE_CHANGED:number = 8;
}

export interface BroadcastEvent {
    key: any;
    data?: any;
}

export class Broadcaster {
    private _eventBus: Subject<BroadcastEvent>;

    constructor() {
        this._eventBus = new Subject<BroadcastEvent>();
    }

    broadcast(key: any, data?: any) {
        this._eventBus.next({ key, data });
    }

    on<T>(key: any): Observable<T> {
        return this._eventBus.asObservable()
            .filter(event => event.key === key)
            .map(event => <T>event.data);
    }
}
