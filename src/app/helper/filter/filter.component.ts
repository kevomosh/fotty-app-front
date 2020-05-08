import { Component, OnDestroy } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnDestroy {
  constructor(private filterService: FilterService) {}

  currentInputValue$ = this.filterService.getNameStringFilter();
  userGroups$ = this.filterService.getUserGroups();

  combinedStream$ = combineLatest([
    this.currentInputValue$,
    this.userGroups$,
  ]).pipe(
    map(([inputValue, userGroups]) => ({
      inputValue,
      userGroups,
    }))
  );

  updateFilter(event: any) {
    this.filterService.updateInputFilter(event);
  }

  filterGroup(groupName: string) {
    this.filterService.updateGroupFilter(groupName);
  }

  ngOnDestroy() {
    this.filterService.clearAllFilterInputs();
  }
}
