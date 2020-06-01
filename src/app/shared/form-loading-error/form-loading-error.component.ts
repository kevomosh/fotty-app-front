import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadingErrorService } from 'src/app/services/loading-error.service';

@Component({
  selector: 'loading-error',
  templateUrl: './form-loading-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./form-loading-error.component.css'],
})
export class FormLoadingErrorComponent implements OnDestroy {
  constructor(public loadingErrorService: LoadingErrorService) {}

  @Input() loadingMessage: string;
  @Input() errorMessage: string;

  stream$ = combineLatest([
    this.loadingErrorService.loading$,
    this.loadingErrorService.error$,
    this.loadingErrorService.success$,
  ]).pipe(
    map(([loading, error, success]) => ({
      loading,
      error,
      success,
    }))
  );

  ngOnDestroy() {
    this.loadingErrorService.cancelLoadingAndError();
  }
}
