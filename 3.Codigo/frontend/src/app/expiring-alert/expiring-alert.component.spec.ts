import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiringAlertComponent } from './expiring-alert.component';

describe('ExpiringAlertComponent', () => {
  let component: ExpiringAlertComponent;
  let fixture: ComponentFixture<ExpiringAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiringAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiringAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
