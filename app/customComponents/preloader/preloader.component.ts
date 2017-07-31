import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';

@Component({
      selector: 'preloader',
      templateUrl: 'preloader.component.html',
      styleUrls: ['preloader.component.css']
})
export class Preloader implements OnDestroy {
    @Output() complete: EventEmitter<any>;
    private opacity: number;
    private instant: boolean;
    private hideDomElement: boolean;
    private isVisible: boolean;
    private circles: Array<any>;
    private animating: boolean = false;
    private isBusy: boolean = false;
    private inProgress: boolean = false;

    constructor() {
        this.complete = new EventEmitter<any>();
        this.hideDomElement = true;
        this.circles = new Array<any>(5);
        for (let i = 0; i < this.circles.length; i++) {
            this.circles[i] = { random: Math.random() };
        }
     }

    ngOnDestroy() {
        this.animating = false;
    }

    private update() {
        if (this.animating) {
            setTimeout(() => this.update(), 1000 / 45);
        }
        let time = Date.now();
        let x0 = 200;
        let y0 = 150;
        for (let i = 0; i < 5; i++) {
            let angle = 2 * Math.PI * (time + 150 * Math.sin(time / 1000) * i) / 1000;
            let r = 20;
            this.circles[i].x = x0 + - 5 + 10 * (this.circles[i].random) + r * Math.cos(angle);
            this.circles[i].y = y0 + - 5 + 10 * (this.circles[i].random) + r * Math.sin(angle);
            this.circles[i].r = 10 + 10 * this.circles[i].random;
        }
    }

    /** delayInMiliseconds - if data will be loaded before this timeout expired, no spinner will be shown  */
    public show(instant = false, delayInMiliseconds: Number = 0) {
        if (delayInMiliseconds > 0) {
            this.inProgress = true;
            setTimeout(() => {
                if (this.inProgress) {
                    this.showPreloader(instant);
                }
            }, delayInMiliseconds);
        } else {
            this.showPreloader(instant);
        }
    }

    private showPreloader(instant = false) {
        this.hideDomElement = false;
        this.instant = instant;
        this.opacity = 1;
        this.animating = true;
        this.update();
        this.isVisible = true;
        if (instant) {
            this.complete.emit(this.isVisible);
        } else {
            this.isBusy = true;
        }
    }

    public hide(instant: boolean = false) {
        this.inProgress = false;

        if (this.isBusy) {    // unlock screen if previous transition not done
            this.hideDomElement = true;
        }

        this.isVisible = false;
        this.instant = instant;
        this.opacity = 0;
        if (instant) {
            this.hideDomElement = true;
            this.animating = false;
            this.complete.emit(this.isVisible);
        } else {
            this.isBusy = true;
        }
    }

    private onTransitionEnd() {  /*css transition finished*/

        if (this.isVisible) { /*transition to visible finished*/
            this.complete.emit(this.isVisible);
        } else {	/*transition to invisible finished*/
            this.hideDomElement = true;
            this.animating = false;
            this.complete.emit(this.isVisible);
        }

        this.isBusy = false;
    }
}
