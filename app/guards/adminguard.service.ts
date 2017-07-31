import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsersService } from "../services/users.service";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(protected router: Router,
                private userService: UsersService) {

    }
    canActivate() {
        let isAdmin = this.userService.isAdmin();
        if (!isAdmin){
            this.router.navigate([""]);
        }
        return isAdmin;
    }
}
