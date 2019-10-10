import { Observable } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { RolesService } from 'src/app/_services';
import { Role, User } from 'src/app/_models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-list-user-roles',
  templateUrl: './list-user-roles.component.html',
  styleUrls: ['./list-user-roles.component.scss']
})
export class ListUserRolesComponent implements OnInit {
  @Input() user: User;
  roles: Role[];
  showAdd: boolean;
  constructor(
    private roleService: RolesService
  ) { }

  ngOnInit() {
   this.getUserRoles();
  }
  getUserRoles() {
    this.roleService.getRolesForUser(this.user.UserId)
    .subscribe(response => {
      this.roles = response;
    });

  }

  showAddForm() {
    this.showAdd = !this.showAdd;
  }
  toggleTodo(event) {
    this.showAdd = event;
    this.getUserRoles();
   }
}
