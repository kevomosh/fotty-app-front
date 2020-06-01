import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbAlertModule,
  NgbButtonsModule,
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FilterComponent } from './filter/filter.component';
import { FormLoadingErrorComponent } from './form-loading-error/form-loading-error.component';
import { SpinnerComponent } from './spinner/spinner.component';

const bootStrapModules = [
  NgbAlertModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbButtonsModule,
  NgbDatepickerModule,
  NgbPaginationModule,
  NgbAlertModule,
];

@NgModule({
  declarations: [FilterComponent, SpinnerComponent, FormLoadingErrorComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    bootStrapModules,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    bootStrapModules,
    FilterComponent,
    SpinnerComponent,
    FormLoadingErrorComponent,
  ],
})
export class SharedModule {}
