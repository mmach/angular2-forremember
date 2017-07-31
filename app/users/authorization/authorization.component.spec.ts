//import {
//  beforeEach,
//  beforeEachProviders,
//  describe,
//  expect,
//  it,
//  inject,
//} from '@angular/core/testing';
//import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
//import { Component } from '@angular/core';
//import { By } from '@angular/platform-browser';
//import { ContainersComponent } from './containers.component';

//describe('Component: Containers', () => {
//  let builder: TestComponentBuilder;

//  beforeEachProviders(() => [ContainersComponent]);
//  beforeEach(inject([TestComponentBuilder], function (tcb: TestComponentBuilder) {
//    builder = tcb;
//  }));

//  it('should inject the component', inject([ContainersComponent],
//      (component: ContainersComponent) => {
//    expect(component).toBeTruthy();
//  }));

//  it('should create the component', inject([], () => {
//    return builder.createAsync(ContainersComponentTestController)
//      .then((fixture: ComponentFixture<any>) => {
//        let query = fixture.debugElement.query(By.directive(ContainersComponent));
//        expect(query).toBeTruthy();
//        expect(query.componentInstance).toBeTruthy();
//      });
//  }));
//});

//@Component({
//  selector: 'test',
//  template: `
//    <app-containers></app-containers>
//  `,
//  directives: [ContainersComponent]
//})
//class ContainersComponentTestController {
//}

