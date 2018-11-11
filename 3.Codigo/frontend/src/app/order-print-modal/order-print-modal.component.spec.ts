import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPrintModalComponent } from './order-print-modal.component';

describe('OrderPrintModalComponent', () => {
  let component: OrderPrintModalComponent;
  let fixture: ComponentFixture<OrderPrintModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPrintModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPrintModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
