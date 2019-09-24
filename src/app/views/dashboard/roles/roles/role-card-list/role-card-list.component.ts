import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from 'src/app/_models';

@Component({
  selector: 'app-role-card-list',
  templateUrl: './role-card-list.component.html',
  styleUrls: ['./role-card-list.component.scss']
})
export class RoleCardListComponent implements OnInit {
  @Input() roles: Observable<Role[]>;
  constructor() { }

  ngOnInit() {
  }

}
