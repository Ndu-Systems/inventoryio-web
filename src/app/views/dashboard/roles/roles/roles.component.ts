import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BannerService, RolesService, AccountService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { Role, User, NotFoundModel } from 'src/app/_models';
import { NotFoundConstants, StatusConstant } from '../../shared';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  search: string;
  roles$: Observable<Role[]>;
  constructor(
    private bannerService: BannerService,
    private roleService: RolesService,
    private routeTo: Router,
    private accountService: AccountService,

  ) {
    this.bannerService.updateState({
      heading: 'Manage Roles',
      backto: '/dashboard/configurations'
    });
  }

  ngOnInit() {
    this.roles$ = this.roleService.roles;
    const user: User = this.accountService.currentUserValue;
    if (!user) {
      this.accountService.logout();
      this.routeTo.navigate(['sign-in']);
    }

    this.roleService.getAllRoles(user.CompanyId, StatusConstant.ACTIVE_STATUS);
  }

  add() {
    this.routeTo.navigate(['dashboard/add-role']);
  }

  getRoleDetails(role: Role) {
    this.routeTo.navigate([`/dashboard/role-details/${role.RoleId}`]);
  }

}
