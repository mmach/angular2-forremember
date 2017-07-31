import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthorizationAction} from '../../models/actions/authorizationAction';
import { UserAuthorization } from '../../models/userAuthorization';
import { UsersService } from "../../services/users.service";

@Component({
    selector: 'app-authorization',
    templateUrl: 'authorization.component.html',
    styleUrls: ['authorization.component.css']
})
export class AuthorizationComponent implements OnInit {

    private routeSubscription: Subscription;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private usersService: UsersService) {
    }

    public ngOnInit() {
        this.routeSubscription = this.activatedRoute.params.subscribe(params => this.onRouteActivated(params));
    }

    public onRouteActivated(params) {
        let userAuth: UserAuthorization = new UserAuthorization();
        userAuth.UserId = params["userId"];
        userAuth.AuthorizationGuid = params["authorizationGuid"];
        let model: AuthorizationAction = new AuthorizationAction(userAuth);

        this.usersService.command(model).subscribe(
            result => {
                this.usersService.succMsgBroadcast(result);
                setTimeout(() => {
                    this.router.navigate(['login']);
                }, 2000);
            });
    }

    public onNgDestroy() {
        this.routeSubscription.unsubscribe();
    }
}
