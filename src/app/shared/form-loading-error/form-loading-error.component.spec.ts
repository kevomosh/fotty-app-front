import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLoadingErrorComponent } from './form-loading-error.component';

describe('FormLoadingErrorComponent', () => {
  let component: FormLoadingErrorComponent;
  let fixture: ComponentFixture<FormLoadingErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormLoadingErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLoadingErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
