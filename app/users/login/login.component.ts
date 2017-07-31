import { Component, OnInit } from '@angular/core';
import { LoginAction } from '../../models/actions/loginAction';
import { UsersService } from "../../services/users.service";
import { Broadcaster} from '../../helper/broadcast';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ValidationModel } from '../../customComponents/validation/validation-model.directive'
import { ValidatorService } from "../../services/validator.service";

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css'],
    providers: [ValidatorService]
})
export class LoginComponent implements OnInit {

    private model: LoginAction;
    private redirectUrl: string;
    private routeSubscription: Subscription;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private userService: UsersService,
                private validatorService: ValidatorService,
                private broadcaster: Broadcaster) {
    }

    public ngOnInit() {
        this.model = new LoginAction();
        this.redirectUrl = null;
        this.routeSubscription = this.activatedRoute.params.subscribe(params => this.onRouteActivated(params));
    }

    public onRouteActivated(params) {
        this.redirectUrl = params["redirectUrl"];
        if(this.redirectUrl != null)
            this.validatorService.setGlobalInfoMessage("You are not logged in");
    }

    public onSubmit() {
        if (this.validatorService.validate()) {

            this.model.grant_type = "password";
            this.userService.validatorService = this.validatorService;
            this.userService.Login(this.model, "/Login").subscribe(
                result => {
                    this.userService.LogIn(String(result));
                    this.validatorService.setGlobalSuccessMessage("You are logged in");
                    this.broadcaster.broadcast("USER_AUTHENTICATED", {});
                    setTimeout(() =>
                    {                        
                        if(this.redirectUrl == null)
                            this.router.navigate([""])
                        else
                            this.router.navigate([this.redirectUrl])                            
                    }, 2000);
                },
                error => {
                    var errorKey = JSON.parse(error._body).error;
                    var errorDescription = JSON.parse(error._body).error_description;

                    //Special case for login component.
                    //Validated manually. Login do not use CommandController!
                    if (errorDescription) {
                        this.validatorService.getValidationModel(errorKey).setValid(false, errorDescription);
                    } else {
                        this.validatorService.setGlobalErrorMessage(errorKey);
                    }
                });
        }
    }

    cancel() {
        this.router.navigate([""]);
    }

    public onNgDestroy() {
        this.routeSubscription.unsubscribe();
    }
}
