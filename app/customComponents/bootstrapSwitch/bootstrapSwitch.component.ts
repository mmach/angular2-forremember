import { Component, ElementRef, Input, OnInit, ViewContainerRef, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'bootstrap-switch',
    templateUrl: 'bootstrapSwitch.component.html'
    // styleUrls: ['bootstrap-switch.min.css']
})
export class BootstrapSwitchComponent implements OnInit {

    @Input() private defaultValue: Boolean = false;
    @Output() onChange = new EventEmitter<any>();

    jQuery: any = $;
    $el;

    get checked(): boolean{
        return this.$el.is(':checked');
    }

    set checked(value){
        this.$el.bootstrapSwitch('state', value);
    }

    getParentComponent() {
            let parentComponentView = (<any>this._view).parentInjector._view;
            while (parentComponentView.context.constructor.name === 'Object') {
                parentComponentView = parentComponentView.parentInjector._view;
            }
            return parentComponentView.context;
    }

    constructor(private el: ElementRef,
                private _view: ViewContainerRef) {

    }

    ngOnInit() {
        this.$el = this.jQuery(this.el.nativeElement.firstChild).bootstrapSwitch('state', this.defaultValue);

        let thisRef = this;
        this.$el.on('switchChange.bootstrapSwitch', function(event, state) {
            let parentComponent = thisRef.getParentComponent();        
            thisRef.onChange.emit();  
        });
    }
}
