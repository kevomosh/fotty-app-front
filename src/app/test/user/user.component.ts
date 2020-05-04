import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    //emit ({name: 'Joe', age: 31}, {name: 'Bob', age:25})
    const source = from([
      { name: 'Joe', age: 31 },
      { name: 'Bob', age: 25 },
    ]);

    //filter out people with age under 30
    const example = source.pipe(filter((person) => person.age >= 30));
    //output: "Over 30: Joe"
    // const subscribe = example.subscribe((val) =>
    //   console.log(`Over 30: ${val.name}`)
    // );
  }
}
