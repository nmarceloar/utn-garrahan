import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitEditModalComponent } from './unit-edit-modal.component';

describe('UnitEditModalComponent', () => {
  let component: UnitEditModalComponent;
  let fixture: ComponentFixture<UnitEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
