import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
    selector: 'overlay-wrapper',
    templateUrl: 'overlayWrapper.component.html',
    styleUrls: ['overlayWrapper.component.css']
})
export class OverlayWrapperComponent implements OnInit {

    private topMenuHeight = 55;
    @Input() private OverlayWrapperPosition = "left";

    private _overlayWrapperPosition = OverlayWrapperPositionEnum.LEFT;
    public get overlayWrapperPosition() {
        return this._overlayWrapperPosition;
    }
    public set overlayWrapperPosition(value) {
        this._overlayWrapperPosition = value;
    }

    public get isLeftSided() {
        return this._overlayWrapperPosition == OverlayWrapperPositionEnum.LEFT;
    }

    public get isRightSided() {
        return this._overlayWrapperPosition == OverlayWrapperPositionEnum.RIGHT;
    }

    public get windowInnerWidth() {
        return window.innerWidth;
    }

    width = 320;
    totalAnimationMilisecond = 700;

    jQuery: any = $;

    get overlayWrapperBackgroudElement() {
        return this.el.nativeElement.firstChild;
    }

    private _$overlayWrapperBackgroudElement: any;
    get $overlayWrapperBackgroudElement() {
        if (!this._$overlayWrapperBackgroudElement) {
            this._$overlayWrapperBackgroudElement = (<any>$(this.overlayWrapperBackgroudElement));
        }
        return this._$overlayWrapperBackgroudElement;
    }

    get overlayWrapperPanelElement() {
        return this.el.nativeElement.children[1];
    }

    private _$overlayWrapperPanelElement: any;
    get $overlayWrapperPanelElement() {
        if (!this._$overlayWrapperPanelElement) {
            this._$overlayWrapperPanelElement = (<any>$(this.overlayWrapperPanelElement));
        }
        return this._$overlayWrapperPanelElement;
    }

    constructor(private el: ElementRef) {

    }

    ngOnInit() {
        if (this.OverlayWrapperPosition == "right") {
            this.overlayWrapperPosition = OverlayWrapperPositionEnum.RIGHT;
        }
    }

    outSideClickCloseCallback(event) {
        if (!this.isTargetModal(event.target) && !this.$overlayWrapperPanelElement.is(event.target) && this.$overlayWrapperPanelElement.has(event.target).length === 0) {
            this.closeOverlayPanel();
        }
    }

    isTargetModal(target) {
        let isTargetModal = false;
        let tempTarget = target;
        while (!isTargetModal && tempTarget) {
            isTargetModal = tempTarget.className.indexOf("modal") != -1;
            tempTarget = tempTarget.parentElement;
        }
        return isTargetModal;
    }

    documentScrollCallback(event) {
        this.setTopDistance();
    }

    setTopDistance() {
        let scroll = (<any>window).scrollY;
        if (scroll > 0 && this.$overlayWrapperPanelElement.css("top") == `${this.topMenuHeight}px`) {
            this.$overlayWrapperPanelElement.animate({
                top: "0px"
            }, this.totalAnimationMilisecond);
        } else if (scroll == 0 && this.$overlayWrapperPanelElement.css("top") == "0px") {
            this.$overlayWrapperPanelElement.animate({
                top: `${this.topMenuHeight}px`
            }, this.totalAnimationMilisecond);
        }
    }

    openOverlayPanel(event: any = undefined) {
        this.setTopDistance();

        //Bind outside click to close event.
        if (event) {
            event.stopPropagation();
            this.outSideClickCloseCallback = this.outSideClickCloseCallback.bind(this);
            document.body.addEventListener('click', this.outSideClickCloseCallback, false);
        }

        //Bind window scroll to change top css event.
        this.documentScrollCallback = this.documentScrollCallback.bind(this);
        window.addEventListener("scroll", this.documentScrollCallback, false);

        //Show background.
        this.overlayWrapperBackgroudElement.style.display = "block";
        this.$overlayWrapperBackgroudElement.animate({
            opacity: 0.5
        }, this.totalAnimationMilisecond);

        //Show wrapper.
        switch (this._overlayWrapperPosition) {
            case OverlayWrapperPositionEnum.LEFT:
                {
                    this.$overlayWrapperPanelElement.animate({
                        opacity: 1,
                        left: "0px"
                    }, this.totalAnimationMilisecond);

                    break;
                }
            case OverlayWrapperPositionEnum.RIGHT:
                {
                    let hasScrollbar = this.windowInnerWidth > document.documentElement.clientWidth;
                    let scrollBarWidth = hasScrollbar ? 17 : 0;
                    this.$overlayWrapperPanelElement.animate({
                        opacity: 1,
                        left: (this.windowInnerWidth - this.width - scrollBarWidth) + "px"
                    }, this.totalAnimationMilisecond);

                    break;
                }
        }
    }

    closeOverlayPanel() {
        //Remove binded events.
        document.body.removeEventListener('click', this.outSideClickCloseCallback, false);
        window.removeEventListener("scroll", this.documentScrollCallback, false);

        //Hide background.
        let thisRef = this;
        this.$overlayWrapperBackgroudElement.animate({
            opacity: 0
        }, this.totalAnimationMilisecond, null, function () {
            thisRef.el.nativeElement.firstChild.style.display = "none";
        });

        //Hide wrapper.
        switch (this._overlayWrapperPosition) {
            case OverlayWrapperPositionEnum.LEFT:
                {
                    this.$overlayWrapperPanelElement.animate({
                        opacity: 0.25,
                        left: "-" + this.width + "px"
                    }, this.totalAnimationMilisecond);

                    break;
                }
            case OverlayWrapperPositionEnum.RIGHT:
                {
                    this.$overlayWrapperPanelElement.animate({
                        opacity: 0.25,
                        left: this.windowInnerWidth + "px"
                    }, this.totalAnimationMilisecond);

                    break;
                }
        }
    }
}

export enum OverlayWrapperPositionEnum {
    LEFT,
    RIGHT
}
