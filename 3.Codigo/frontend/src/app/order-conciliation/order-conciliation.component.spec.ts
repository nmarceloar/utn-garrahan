import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConciliationComponent } from './order-conciliation.component';

describe('OrderConciliationComponent', () => {
  let component: OrderConciliationComponent;
  let fixture: ComponentFixture<OrderConciliationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderConciliationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderConciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
