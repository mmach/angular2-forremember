import { BaseAction } from "./baseAction";

export class UserAuthAction extends BaseAction {
    
    constructor(public _cookieService: CookieService) {
        super();
        
    }

    getAuthToken() {
        return 'Bearer ' + this._cookieService.get('token');
    }
}
