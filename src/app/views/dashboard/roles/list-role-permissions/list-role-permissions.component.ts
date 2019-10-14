import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Role, Permission, SystemPermissionModel, NotFoundModel } from 'src/app/_models';
import { Observable } from 'rxjs';
import { PermissionsService, BannerService, AccountService, RolesService } from 'src/app/_services';
import { SharedService } from '../../shared/shared.service';
import { NotFoundConstants } from '../../shared';

@Component({
  selector: 'app-list-role-permissions',
  templateUrl: './list-role-permissions.component.html',
  styleUrls: ['./list-role-permissions.component.scss']
})
export class ListRolePermissionsComponent implements OnInit {
  @Input() roleId: string;
  notFoundModel: NotFoundModel;
  permissions: SystemPermissionModel[] = [];
  constructor(
    private bannerService: BannerService,
    private sharedService: SharedService,
    private accountService: AccountService,

  ) { }

  ngOnInit() {
    this.permissions = this.sharedService.loadRolePermissions(this.roleId);
    this.notFoundModel = {
      Image: NotFoundConstants.NOT_FOUND_ITEMS.image,
      Message: NotFoundConstants.NOT_FOUND_ITEMS.message
    };
  }

  add() {

  }



}
