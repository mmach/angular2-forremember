import { UserAuthorization } from "../userAuthorization";
import { UserNotAuthAction } from './UserNotAuthAction'

export class AuthorizationAction extends UserNotAuthAction {
    public Action: string = "AuthorizationAction";

    constructor(public model: UserAuthorization) {
        super();
    }
}
