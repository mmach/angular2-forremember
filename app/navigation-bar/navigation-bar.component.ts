import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UsersService } from "../services/users.service";
import { BaseService } from "../services/base.service";
import { Broadcaster } from '../helper/broadcast';
import { UserDetails } from '../models/UserDetails';

@Component({
    selector: "navigation-bar",
    templateUrl: "navigation-bar.component.html",
    styleUrls: ["navigation-bar.component.css"]
})
export class NavigationBarComponent implements OnInit {

    private isAuthenticated: boolean = false;
    private isAdmin: boolean = true;
    private authenticatedUserName: string = "";
    private userDetails: UserDetails;

    constructor(private router: Router,
        private broadcaster: Broadcaster,
        private usersService: UsersService,
        private baseService: BaseService
    ) { }

    ngOnInit() {
        this.broadcaster.on("USER_AUTHENTICATED").subscribe(() => this.refresh());
        this.isAdmin = this.usersService.isAdmin();
        this.refresh();
    }

    private refresh() {
        this.isAuthenticated = this.usersService.isAuthenticated();
        if (this.isAuthenticated) {
            this.baseService
                .command({ "Action": "GetUserDetailsAction"})
                .subscribe(
                    result => this.userDetails = result,
                    error => console.error(error)
                );
        }
    }

    private onLogInLinkClick() {
        this.router.navigate(["login"]);
        this.refresh();
    }

    private onLogOutLinkClick() {
        this.usersService.LogOut();

        this.router.navigate(["login", this.router.url]);
        this.refresh();
    }

    private getNameSurname(): string {
        if(this.userDetails != null)
            return [this.userDetails.name, this.userDetails.surname].join(' ');
        else
            return ""
    }

    private getOfficeName(): string {
        if(this.userDetails != null)
            return this.userDetails.officeName;
        else
            return ""
    }

    private getRoleName(): string {
        if(this.userDetails != null)
            return this.userDetails.roleName;
        else
            return ""
    }
}