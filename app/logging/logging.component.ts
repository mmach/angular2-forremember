import { Component, OnInit } from "@angular/core";
import { Router, ROUTER_DIRECTIVES } from "@angular/router";
import { ILogList } from "../models/loglist";
import { LogginService } from "../services/logging.service";

@Component({
    templateUrl: "logging.component.html",
    styleUrls: ["logging.component.css"]
})
export class LoggingComponent {

    logList: Array<string>;

    constructor(        
        public router: Router,        
        private logs: LogginService
    ) {
        this.logs.getLogList("d:\text.txt").subscribe((c) => {
            this.logList = c
        });
    }
}