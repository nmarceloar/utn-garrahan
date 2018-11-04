import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHemocomponentModalComponent } from './edit-hemocomponent-modal.component';

describe('EditHemocomponentModalComponent', () => {
  let component: EditHemocomponentModalComponent;
  let fixture: ComponentFixture<EditHemocomponentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHemocomponentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHemocomponentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
