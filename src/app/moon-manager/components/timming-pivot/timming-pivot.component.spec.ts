// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimmingPivotComponent } from './timming-pivot.component';

describe('TimmingPivotComponent', () => {
  let component: TimmingPivotComponent;
  let fixture: ComponentFixture<TimmingPivotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimmingPivotComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimmingPivotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
