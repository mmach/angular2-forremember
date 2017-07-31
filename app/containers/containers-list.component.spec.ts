import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject,
} from '@angular/core/testing';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ContainersListComponent } from './containers-list.component';

describe('Component: Containers', () => {
  let builder: TestComponentBuilder;

  beforeEachProviders(() => [ContainersListComponent]);
  beforeEach(inject([TestComponentBuilder], function (tcb: TestComponentBuilder) {
    builder = tcb;
  }));

  it('should inject the component', inject([ContainersListComponent],
      (component: ContainersListComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should create the component', inject([], () => {
      return builder.createAsync(ContainersListComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
          let query = fixture.debugElement.query(By.directive(ContainersListComponent));
        expect(query).toBeTruthy();
        expect(query.componentInstance).toBeTruthy();
      });
  }));
});

@Component({
  selector: 'test',
  template: `
    <app-containers></app-containers>
  `,
  directives: [ContainersListComponent]
})
class ContainersListComponentTestController {
}

