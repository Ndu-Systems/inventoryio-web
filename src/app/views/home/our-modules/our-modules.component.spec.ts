/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OurModulesComponent } from './our-modules.component';

describe('OurModulesComponent', () => {
  let component: OurModulesComponent;
  let fixture: ComponentFixture<OurModulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurModulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
