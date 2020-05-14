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
  declarations: [FilterComponent],
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
  ],
})
export class SharedModule {}
