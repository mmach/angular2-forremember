import { Component, OnInit } from '@angular/core';
import {UsersService } from "../services/users.service";



@Component({
  selector: 'app-users',
  templateUrl: 'users.component.html',
  styleUrls: ['users.component.css'],
})
export class ContainersComponent implements OnInit {

    constructor(private userService: UsersService) {



    }


  ngOnInit() {
  }

}
