import { UserRegister } from "../userRegister";
import { UserNotAuthAction } from './UserNotAuthAction'

export class RegisterUserAction extends UserNotAuthAction {
    public Action: string = "RegisterUserAction";
    public ForValid: boolean
    constructor(public model: UserRegister) {
        super();
    }
}
