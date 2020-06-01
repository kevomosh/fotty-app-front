import { Component, OnDestroy } from '@angular/core';
import { PaginationService } from 'src/app/services/pagination.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnDestroy {
  constructor(public paginationService: PaginationService) {}

  ngOnDestroy() {
    this.paginationService.reset();
  }
}
