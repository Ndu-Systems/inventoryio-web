import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BannerService, RolesService, AccountService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { Role, User } from 'src/app/_models';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  search: string;
  roles: Observable<Role[]>;
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
    this.roles = this.roleService.roles;
    const user: User = this.accountService.currentUserValue;
    if (!user) {
      this.accountService.logout();
      this.routeTo.navigate(['sign-in']);
    }
    this.roleService.getAllRoles(user.CompanyId);
  }

  add() {
    this.routeTo.navigate(['dashboard/add-role']);
  }
  add(){
    alert('#TODO');
  }
}
