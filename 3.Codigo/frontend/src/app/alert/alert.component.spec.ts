import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageStackComponent } from './alert.component';

describe('MessageStackComponent', () => {
  let component: MessageStackComponent;
  let fixture: ComponentFixture<MessageStackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageStackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
