import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnDestroy {
  constructor(
    private filterService: FilterService,
    private authService: AuthService
  ) {}

  currentInputValue$ = this.filterService.getNameStringFilter();
  userGroups$ = this.authService.userGroups;
  pickedGroup$ = this.filterService.getGroupSubject();

  combinedStream$ = combineLatest([
    this.currentInputValue$,
    this.userGroups$,
    this.pickedGroup$,
  ]).pipe(
    map(([inputValue, userGroups, pickedGroup]) => ({
      inputValue,
      userGroups,
      pickedGroup,
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
