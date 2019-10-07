import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Role, NotFoundModel } from 'src/app/_models';
import { Router } from '@angular/router';
import { NotFoundConstants } from '../../../shared';

@Component({
  selector: 'app-role-card-list',
  templateUrl: './role-card-list.component.html',
  styleUrls: ['./role-card-list.component.scss']
})
export class RoleCardListComponent implements OnInit {
  @Input() roles: Role[];
  notFoundModel: NotFoundModel;

  constructor(
    private routeTo: Router
  ) { }

  ngOnInit() {
    this.notFoundModel = {
      Image: NotFoundConstants.NOT_FOUND_ITEMS.image,
      Message: NotFoundConstants.NOT_FOUND_ITEMS.message
    };
  }
  getRoleDetails(role: Role) {
     this.routeTo.navigate([`/dashboard/role-details/${role.RoleId}`]);
  }


}
