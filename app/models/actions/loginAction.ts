import { UserNotAuthAction } from './UserNotAuthAction'

export class LoginAction extends UserNotAuthAction {
    userName: string;
    password: string;
    grant_type: string;
}
