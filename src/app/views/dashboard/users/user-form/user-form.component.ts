import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @Input() User: User;
  constructor() { }

  ngOnInit() {}

}
