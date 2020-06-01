import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./access-denied.component.css'],
})
export class AccessDeniedComponent {}
