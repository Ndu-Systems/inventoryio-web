import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Role, Permission, SystemPermissionModel } from 'src/app/_models';
import { Observable } from 'rxjs';
import { PermissionsService, BannerService, AccountService, RolesService } from 'src/app/_services';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-list-role-permissions',
  templateUrl: './list-role-permissions.component.html',
  styleUrls: ['./list-role-permissions.component.scss']
})
export class ListRolePermissionsComponent implements OnInit {
  @Input() roleId: string;
  showAdd: boolean;
  permissions: SystemPermissionModel[] = [];
  constructor(
    private bannerService: BannerService,
    private sharedService: SharedService,
    private accountService: AccountService,

  ) { }

  ngOnInit() {
    this.permissions = this.sharedService.loadRolePermissions(this.roleId);
  }

  add() {

  }
  showAddForm() {
    this.showAdd = !this.showAdd;
  }
  toggleTodo(event) {
    this.showAdd = event;
    this.permissions = this.sharedService.loadRolePermissions(this.roleId);
  }

}
