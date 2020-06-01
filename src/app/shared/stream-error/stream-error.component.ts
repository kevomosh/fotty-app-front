import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { LoadingErrorService } from 'src/app/services/loading-error.service';

@Component({
  selector: 'stream-error',
  templateUrl: './stream-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./stream-error.component.css'],
})
export class StreamErrorComponent implements OnDestroy {
  constructor(public loadingErrorService: LoadingErrorService) {}
  ngOnDestroy() {
    this.loadingErrorService.cancelStreamError();
  }
}
