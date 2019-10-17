import { Component, OnInit } from '@angular/core';
import { BannerService, PermissionsService, AccountService } from 'src/app/_services';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Permission, User, SystemPermissionModel, NotFoundModel } from 'src/app/_models';
import { SharedService } from '../shared/shared.service';
import { NotFoundConstants, StatusConstant } from '../shared';


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
  notFoundModel: NotFoundModel;
  showForm: boolean;

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
    if (!user) {
      this.accountService.logout();
      this.routeTo.navigate(['sign-in']);
    }
    this.notFoundModel = {
      Image: NotFoundConstants.NOT_FOUND_ITEMS.image,
      Message: NotFoundConstants.NOT_FOUND_ITEMS.message
    };
    this.loadCompanyPermissions(user.CompanyId, StatusConstant.ACTIVE_STATUS);


  }
  add() {
    this.routeTo.navigate(['/dashboard/add-permission']);
  }
  showAdd() {
    this.showForm = !this.showForm;
  }

  loadCompanyPermissions(companyId: string, statusId: string) {
    this.companyPermissions = this.sharedService.loadCompanyPermissions(companyId, statusId);
  }

}

