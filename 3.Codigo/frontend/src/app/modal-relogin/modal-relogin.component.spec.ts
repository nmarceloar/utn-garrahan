import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReloginComponent } from './modal-relogin.component';

describe('ModalReloginComponent', () => {
  let component: ModalReloginComponent;
  let fixture: ComponentFixture<ModalReloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalReloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
