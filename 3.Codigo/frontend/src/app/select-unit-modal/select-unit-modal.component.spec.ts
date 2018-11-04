import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUnitModalComponent } from './select-unit-modal.component';

describe('SelectUnitModalComponent', () => {
  let component: SelectUnitModalComponent;
  let fixture: ComponentFixture<SelectUnitModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectUnitModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectUnitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
