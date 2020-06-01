import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LoadingErrorService } from 'src/app/services/loading-error.service';

@Component({
  selector: 'loading-error',
  templateUrl: './form-loading-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./form-loading-error.component.css'],
})
export class FormLoadingErrorComponent {
  constructor(public loadingErrorService: LoadingErrorService) {}

  @Input() loadingMessage: string;
  @Input() errorMessage: string;
  @Input() streamError: string;
  streamErrorMessage: string =
    'Ooooooops Something went wrong, Please try again later';

  closeAlert() {
    this.loadingErrorService.cancelError();
  }
}
