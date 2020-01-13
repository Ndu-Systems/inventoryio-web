/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QouteComponent } from './qoute.component';

describe('QouteComponent', () => {
  let component: QouteComponent;
  let fixture: ComponentFixture<QouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
