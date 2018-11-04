import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HemocomponentsComponent } from './hemocomponents.component';

describe('HemocomponentsComponent', () => {
  let component: HemocomponentsComponent;
  let fixture: ComponentFixture<HemocomponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HemocomponentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HemocomponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
