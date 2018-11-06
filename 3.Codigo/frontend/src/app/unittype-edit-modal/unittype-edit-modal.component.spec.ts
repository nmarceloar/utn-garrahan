import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnittypeEditModalComponent } from './unittype-edit-modal.component';

describe('UnittypeEditModalComponent', () => {
  let component: UnittypeEditModalComponent;
  let fixture: ComponentFixture<UnittypeEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnittypeEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnittypeEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
