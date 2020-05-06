import { Component } from '@angular/core';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent {
  constructor(private filterService: FilterService) {}

  updateFilter(event: any) {
    this.filterService.updateInputFilter(event);
  }
}
