import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent {
  @Input() childError: string;
  @Input() childWeekNumber: number;

  @Output() chilNo = new EventEmitter<number>();

  constructor(private router: Router) {}

  makePick() {
    this.router.navigateByUrl('/make-pick');
  }

  handleErrorLoadWeekBefore(value: number) {
    this.chilNo.emit(value - 1);
  }
}
