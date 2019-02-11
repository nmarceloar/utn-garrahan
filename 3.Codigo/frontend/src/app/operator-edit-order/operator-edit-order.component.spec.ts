import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorEditOrderComponent } from './operator-edit-order.component';

describe('OperatorEditOrderComponent', () => {
  let component: OperatorEditOrderComponent;
  let fixture: ComponentFixture<OperatorEditOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorEditOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorEditOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
