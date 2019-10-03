import { Component, OnInit } from '@angular/core';
import { BannerService, PermissionsService, AccountService } from 'src/app/_services';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Permission, User, SystemPermissionModel } from 'src/app/_models';
import { SharedService } from '../shared/shared.service';


@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {
  search: string;
  companyPermissions: SystemPermissionModel[] = [];
  systemPermissions: SystemPermissionModel[] = [];
  permissions: Observable<Permission[]>;
  constructor(
    private bannerService: BannerService,
    private permissionService: PermissionsService,
    private routeTo: Router,
    private accountService: AccountService,
    private sharedService: SharedService
  ) {
    this.bannerService.updateState({
      heading: 'Manage Permissions',
      backto: '/dashboard/configurations'
    });

  }

  ngOnInit() {
    this.companyPermissions = [];
    const user: User = this.accountService.currentUserValue;

    this.loadCompanyPermissions(user.CompanyId);
    // this.permissionService.getAllPermissions(user.CompanyId);

    if (!user) {
      this.accountService.logout();
      this.routeTo.navigate(['sign-in']);
    }
  }

  add() {
    this.routeTo.navigate(['dashboard/add-permission']);
  }

  loadCompanyPermissions(companyId: string) {

    this.companyPermissions = this.sharedService.loadCompanyPermissions(companyId);

  }

}

