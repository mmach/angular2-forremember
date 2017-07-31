import { Component, OnInit } from '@angular/core';
import { Broadcaster } from '../helper/broadcast';

@Component({
    selector: "message-bar",
    templateUrl: "message-bar.component.html",
    styleUrls: ["message-bar.component.css"]
})
export class MessageBarComponent implements OnInit {    
    private message: string = "";
    private messageType: string = "";
    private timeoutId: number;

    constructor(private broadcaster: Broadcaster) { }

    ngOnInit() {

        this.broadcaster.on<string>('clearMsg').subscribe(() => {
                this.messageType = "";
                this.message = "";
        });
        var broadcast = this.broadcaster;
        this.broadcaster.on<string>('errorMsg').subscribe(message => {
            clearTimeout(this.timeoutId);
            [this.messageType, this.message] = ['error', message];
            this.timeoutId = setTimeout(function () {
                broadcast.broadcast('clearMsg',{});
            }, 8000);
          
        });

        this.broadcaster.on<string>('infoMsg').subscribe(message => {
            clearTimeout(this.timeoutId);
            [this.messageType, this.message] = ['info', message];
            this.timeoutId = setTimeout(function () {
                broadcast.broadcast('clearMsg', {});
            }, 8000);
        });

        this.broadcaster.on<string>('successMsg').subscribe(message => {
            clearTimeout(this.timeoutId);
            [this.messageType, this.message] = ['success', message];
            this.timeoutId = setTimeout(function () {
                broadcast.broadcast('clearMsg', {});
            }, 8000);
        });

    }

    hide() {
        this.messageType = "";
    }
}
