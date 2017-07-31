import { Component, OnInit } from '@angular/core';
import { RegisterUserAction } from '../../models/actions/registerUserAction';
import { Router } from '@angular/router';
import { UserRegister } from '../../models/userRegister';
import { Role } from '../../models/Role';
import { OfficePath } from '../../models/OfficePath';
import { UsersService } from "../../services/users.service";
import { ValidationModel } from '../../customComponents/validation/validation-model.directive'
import { ValidatorService } from "../../services/validator.service";
import { BaseService } from "../../services/base.service";
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-register',
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.css'],
    providers: [ValidatorService]
})
export class RegisterComponent implements OnInit {
    public model: UserRegister;
    private registerButtonDisabled: boolean = false;

    private roles: Array<Role>;
    private offices: Array<OfficePath>;

    constructor(private baseService: BaseService,
        private userService: UsersService,
        private router: Router,
        private validatorService: ValidatorService) {
        this.model = new UserRegister();
    }

    ngOnInit() {
        let getOfficesAction = this.baseService.command({ "Action": "GetOfficesAction" });
        let getRolesAction = this.baseService.command({ "Action": "GetRolesAction" });

        Observable
            .forkJoin(getRolesAction, getOfficesAction)
            .subscribe(data => {
                this.roles = data[0];
                this.offices = data[1];
            }, error => console.error(error)
            );
    }

    public onSubmit() {
        if (this.validatorService.validate()) {
            this.userService.validatorService = this.validatorService;
            var command = new RegisterUserAction(this.model);
            this.registerButtonDisabled = true;

            this.userService.command(command).subscribe(
                result => {
                    this.registerButtonDisabled = false;
                    this.validatorService.setGlobalSuccessMessage(result);
                },
                error => {
                    this.registerButtonDisabled = false;
                    console.error(error);
                }
            );
        }
    }

    cancel() {
        this.router.navigate([""]);
    }

    private toPath(office: OfficePath): string {
        return [office.countryName, office.cityName, office.officeName].join(' / ');
    }
}
