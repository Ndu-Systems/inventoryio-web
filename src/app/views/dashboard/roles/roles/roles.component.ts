import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BannerService, RolesService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { Role } from 'src/app/_models';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  search: string;
  roles: Observable<Role[]>;
  companyId = '94c5b3cf-d170-11e9-b97c-48f17f8d4d88';
  constructor(
    private bannerService: BannerService,
    private roleService: RolesService,
    private routTo: Router
  ) {
    this.bannerService.updateState({
      heading: 'Manage Roles',
      backto: '/dashboard/configurations'
    });
  }

  ngOnInit() {
    this.roles = this.roleService.roles;
    this.roleService.getAllRoles(this.companyId);
  }

  add() {
    this.routTo.navigate(['dashboard/add-role']);
  }

}
