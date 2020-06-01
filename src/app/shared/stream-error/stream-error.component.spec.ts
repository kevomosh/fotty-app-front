import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamErrorComponent } from './stream-error.component';

describe('StreamErrorComponent', () => {
  let component: StreamErrorComponent;
  let fixture: ComponentFixture<StreamErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
