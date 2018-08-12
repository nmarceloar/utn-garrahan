import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderIrradiationComponent } from './order-irradiation.component';

describe('OrderIrradiationComponent', () => {
  let component: OrderIrradiationComponent;
  let fixture: ComponentFixture<OrderIrradiationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderIrradiationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderIrradiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
