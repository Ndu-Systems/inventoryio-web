import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BannerService, RolesService, AccountService } from 'src/app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { User, Role } from 'src/app/_models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss']
})
export class RoleDetailsComponent implements OnInit {
  rForm: FormGroup;
  roles: Observable<Role[]>;
  role: Observable<Role>;
  roleId: string;
  constructor(
    private fb: FormBuilder,
    private bannerService: BannerService,
    private roleService: RolesService,
    private accountService: AccountService,
    private routeTo: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    const user: User = this.accountService.currentUserValue;
    this.activatedRoute.params.subscribe(r => {
      this.roleId = r.id;
    });
    this.getRole(user.CompanyId, this.roleId);
    if (!user) {
      this.accountService.logout();
      this.routeTo.navigate(['sign-in']);
    }
    this.bannerService.updateState({
      heading: 'Role details',
      backto: '/dashboard/roles'
    });
  }

  getRole(companyId: string, roleId: string) {
    this.roles = this.roleService.roles;
    this.role = this.roleService.roles.pipe(
      map(roles => roles.find(item => item.RoleId === roleId))
    );
    this.roleService.getById(companyId, roleId);
  }




}
