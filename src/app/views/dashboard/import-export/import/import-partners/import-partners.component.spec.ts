/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ImportPartnersComponent } from './import-partners.component';

describe('ImportPartnersComponent', () => {
  let component: ImportPartnersComponent;
  let fixture: ComponentFixture<ImportPartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportPartnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
