import { Component } from '@angular/core';
import { IContainer } from '../models/container';

import { ValidatorService } from '../services/validator.service';

@Component({
    selector: 'container-takeout',
    templateUrl: 'container-takeout.component.html',
    providers: [ValidatorService]
})
export class ContainerTakeOutComponent {
    container: IContainer;
    reason: string;
    reasonWarningVisible: boolean = false;

    constructor(
        private validatorService: ValidatorService
    ) {
    }

    validate(): boolean {
        return this.validatorService.validate();
    }
}
