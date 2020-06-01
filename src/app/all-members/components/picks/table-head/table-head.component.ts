import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'table-head',
  templateUrl: './table-head.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./table-head.component.css'],
})
export class TableHeadComponent implements OnInit {
  @Input() weekNumber: number;
  @Input() currentWeekNumber: number;
  @Input() title: string;
  @Output() weekNumberOutPut = new EventEmitter<number>();

  ngOnInit() {}

  handleLoadWeek(value: number) {
    this.weekNumberOutPut.emit(value);
  }
}
