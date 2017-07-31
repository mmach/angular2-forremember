import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Router, CanActivate } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsersService } from "../services/users.service";

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(protected router: Router,
                private usersService: UsersService ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        let canActivate = this.usersService.isAuthenticated();        
        if(!canActivate)
            this.router.navigate(["login", state.url]);
        
        return canActivate;
    }

    /*canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

        if (state.url !== '/login' && !this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
            return false;
        }

        return true;
    }*/
}
