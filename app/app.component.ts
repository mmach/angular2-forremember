import { Component, OnInit, AfterViewInit, ViewChild,ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Broadcaster } from './helper/broadcast';
import { ModalWindowComponent } from './customComponents/modalWindow/modal-window.component';
import { ModalWindowService } from './services/modalWindow.service';
import { Preloader } from './customComponents';
import * as $ from 'jquery';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    encapsulation: ViewEncapsulation.None
})

//@Routes(ROUTES)
export class AppComponent implements OnInit, AfterViewInit {

    @ViewChild(ModalWindowComponent)
    private modalWindow: ModalWindowComponent;

    @ViewChild(Preloader)
    private preloader: Preloader;

    constructor(
        public router: Router,
        private modalWindowService: ModalWindowService,
        public broadcaster: Broadcaster) {
        (<any>window).GlobalBroadcaster = this.broadcaster;
    }

    ngOnInit() {
        // Vladimir: Looks like these changes doesn't needed anymore. Commented for further investigation.
        // this.router.events.subscribe((event: any): void => {
        //     this.navigationInterceptor(event);
        // });
    }

    ngAfterViewInit() {
        this.modalWindowService.initialize(this.modalWindow);
    }

    // navigationInterceptor(event): void {
    //     if (event instanceof NavigationStart) {
    //         // console.log("navigation start");
    //         this.preloader.show(true);
    //         // setTimeout(() => this.preloader.show(), 100);
    //     } else if (event instanceof NavigationEnd
    //         || event instanceof NavigationCancel
    //         || event instanceof NavigationError) {
    //         // console.log("navigation stop");
    //         this.preloader.hide(true);
    //         // setTimeout(() => this.preloader.hide(true), 0);
    //     }
    // }

}
