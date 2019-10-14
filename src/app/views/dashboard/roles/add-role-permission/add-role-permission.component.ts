import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Permission, User, SystemPermissionModel, RolePermission } from 'src/app/_models';
import { PermissionsService, AccountService, RolesService } from 'src/app/_services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/components/common/messageservice';
import { StatusConstant } from '../../shared';

@Component({
  selector: 'app-add-role-permission',
  templateUrl: './add-role-permission.component.html',
  styleUrls: ['./add-role-permission.component.scss']
})
export class AddRolePermissionComponent implements OnInit {
  @Output() showForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() roleId: string;
  @Output() toggle = new EventEmitter<any>();
  rForm: FormGroup;
  companyPermissions: SystemPermissionModel[] = [];
  dbPermissions: Permission[] = [];
  companyId: string;
  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private permissionService: PermissionsService,
    private accountService: AccountService,
    private sharedService: SharedService,
    private roleService: RolesService,
    private messageService: MessageService,

  ) { }

  ngOnInit() {

    const user: User = this.accountService.currentUserValue;

    this.companyId = user.CompanyId;
    // this.companyPermissions = this.sharedService.loadCompanyPermissions(user.CompanyId);
    this.companyPermissions = this.sharedService.loadCompanyPermissions(this.companyId, StatusConstant.ACTIVE_STATUS);
    this.permissionService.getCompanyPermissions(this.companyId, StatusConstant.ACTIVE_STATUS)
    .subscribe(data => { this.dbPermissions = data; });

    if (!user) {
      this.accountService.logout();
      this.routeTo.navigate(['sign-in']);
    }
    this.rForm = this.fb.group({
      RoleId: [this.roleId, Validators.required],
      PermissionId: [null, Validators.required],
      CreateUserId: [user.UserId, Validators.required],
      ModifyUserId: [user.UserId, Validators.required],
      StatusId: [1, Validators.required],
    });
  }

  onSubmit(rolePermission: RolePermission) {
    if (this.dbPermissions === undefined) {
      return;
    }
    const permission = this.dbPermissions.find(x => x.Name === rolePermission.PermissionId.toLowerCase());
    rolePermission.PermissionId = permission.PermissionId;
    this.roleService.addRolePermissions(rolePermission).subscribe(data => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success.',
        detail: `Permission added to role`
      });
      this.showForm.emit(false);
    });

  }

}
