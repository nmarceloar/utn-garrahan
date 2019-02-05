import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSimulationComponent } from './stock-simulation.component';

describe('StockSimulationComponent', () => {
  let component: StockSimulationComponent;
  let fixture: ComponentFixture<StockSimulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockSimulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
