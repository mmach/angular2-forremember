import { Component, OnInit } from "@angular/core";
import { environment } from "../environment";
import { Broadcaster } from "../helper/broadcast";
import { UsersService } from "../services/users.service";

@Component({
    selector: "app-home",
    templateUrl: "home.component.html",
    styleUrls: ["home.component.css"]
})
export class HomeComponent implements OnInit {
    private isProductionEnvironment: boolean = false;
    private isAuthenticated: boolean = false;
    private authenticatedUserName: string = "";

    constructor(private usersService: UsersService, 
                public broadcaster: Broadcaster) { }

    ngOnInit() {
        this.isProductionEnvironment = environment.production;
        this.broadcaster.on("USER_AUTHENTICATED").subscribe(() => this.refresh());
        this.broadcaster.on("USER_LOGGED_OUT").subscribe(() => this.refresh());
        this.refresh();     
    }

    private refresh() {
        this.isAuthenticated = this.usersService.isAuthenticated();
        if(this.isAuthenticated) {
            this.usersService.getUser().subscribe(
                result => this.authenticatedUserName = result.Name,
                error => console.error(error)
            );
        }
    }
}