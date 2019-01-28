import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorUsbConfigComponent } from './operator-usb-config.component';

describe('OperatorUsbConfigComponent', () => {
  let component: OperatorUsbConfigComponent;
  let fixture: ComponentFixture<OperatorUsbConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorUsbConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorUsbConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
