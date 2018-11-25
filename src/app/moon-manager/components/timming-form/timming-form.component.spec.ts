// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimmingFormComponent } from './timming-form.component';

describe('TimmingFormComponent', () => {
  let component: TimmingFormComponent;
  let fixture: ComponentFixture<TimmingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimmingFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimmingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
