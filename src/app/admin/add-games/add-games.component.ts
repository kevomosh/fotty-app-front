import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { TeamService } from 'src/app/services/team.service';
import { WeekService } from 'src/app/services/week.service';

@Component({
  selector: 'app-add-games',
  templateUrl: './add-games.component.html',
  styleUrls: ['./add-games.component.css'],
})
export class AddGamesComponent implements OnInit, OnDestroy {
  private onStop: Subject<void> = new Subject<void>();
  weekNumberRange: number[] = Array.from({ length: 30 }, (v, k) => k + 1);
  gameNumberRange: number[] = Array.from({ length: 8 }, (v, k) => k + 1);

  addGameForm: FormGroup;

  availabeWeeks$ = this.weekService
    .getTotalNumberOfWeeks()
    .pipe(map((number) => 'You have a total of ' + number + ' in db'));

  allTeams$ = this.teamService.getAllteams();

  combinedStream$ = combineLatest([this.availabeWeeks$, this.allTeams$]).pipe(
    map(([availableWeekMessage, allTeams]) => ({
      availableWeekMessage,
      allTeams,
    }))
  );

  constructor(
    private teamService: TeamService,
    private fb: FormBuilder,
    private weekService: WeekService,
    private router: Router
  ) {}

  ngOnInit() {
    this.addGameForm = this.fb.group({
      weekNumber: ['', Validators.required],
      year: [2020, Validators.required],
      month: ['', Validators.required],
      dayOfMonth: ['', Validators.required],
      hour: ['', Validators.required],
      minute: ['', Validators.required],
      offHours: ['', Validators.required],
      matchesThisWeek: this.fb.array([this.addMatchGroup()]),
    });
  }

  onSubmit() {
    let details = this.addGameForm.value;
    const weekInfo = {
      weekNumber: details.weekNumber,
      sortedMatchesToBePlayed: details.matchesThisWeek,
      deadLine: {
        year: details.year,
        month: details.month,
        dayOfMonth: details.dayOfMonth,
        hour: details.hour,
        minute: details.minute,
        offHours: details.offHours,
      },
    };

    this.weekService
      .createNewWeek(weekInfo)
      .pipe(takeUntil(this.onStop))
      .subscribe(() => {
        this.router.navigateByUrl('/results');
      });
  }

  private addMatchGroup(): FormGroup {
    return this.fb.group({
      gameNumber: ['', Validators.required],
      homeTeam: ['', Validators.required],
      awayTeam: ['', Validators.required],
    });
  }

  groupFormArray() {
    return <FormArray>this.addGameForm.get('matchesThisWeek');
  }
  addMatchButtonClick(): void {
    (<FormArray>this.addGameForm.get('matchesThisWeek')).push(
      this.addMatchGroup()
    );
  }

  removeMatchButtonClick(index: number): void {
    this.groupFormArray().removeAt(index);
  }

  ngOnDestroy() {
    this.onStop.next();
    this.onStop.complete();
  }
}
