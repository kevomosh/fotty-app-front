import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakePickComponent } from './make-pick.component';

describe('MakePickComponent', () => {
  let component: MakePickComponent;
  let fixture: ComponentFixture<MakePickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakePickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakePickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
