import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientUsbConfigComponent } from './client-usb-config.component';

describe('ClientUsbConfigComponent', () => {
  let component: ClientUsbConfigComponent;
  let fixture: ComponentFixture<ClientUsbConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientUsbConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientUsbConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
