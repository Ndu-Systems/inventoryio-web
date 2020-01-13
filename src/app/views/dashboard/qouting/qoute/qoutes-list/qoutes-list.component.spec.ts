/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QoutesListComponent } from './qoutes-list.component';

describe('QoutesListComponent', () => {
  let component: QoutesListComponent;
  let fixture: ComponentFixture<QoutesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QoutesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QoutesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
