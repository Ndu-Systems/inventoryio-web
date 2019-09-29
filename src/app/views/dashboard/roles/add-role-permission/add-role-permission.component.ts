import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Permission, User, SystemPermissionModel } from 'src/app/_models';
import { PermissionsService, AccountService, RolesService } from 'src/app/_services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-role-permission',
  templateUrl: './add-role-permission.component.html',
  styleUrls: ['./add-role-permission.component.scss']
})
export class AddRolePermissionComponent implements OnInit {
  @Input() roleId: string;
  @Output() toggle = new EventEmitter<any>();
  rForm: FormGroup;
  companyPermissions: SystemPermissionModel[] = [];
  companyId: string;
  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private permissionService: PermissionsService,
    private accountService: AccountService,
    private sharedService: SharedService,
    private roleService: RolesService

  ) { }

  ngOnInit() {

    const user: User = this.accountService.currentUserValue;

    this.companyId = user.CompanyId;
    // this.companyPermissions = this.sharedService.loadCompanyPermissions(user.CompanyId);
    this.companyPermissions = this.sharedService.loadCompanyPermissions('1');

    if (!user) {
      this.accountService.logout();
      this.routeTo.navigate(['sign-in']);
    }
    this.rForm = this.fb.group({
      RoleId: [this.roleId, Validators.required],
      Name: [null, Validators.required],
      CreateUserId: [user.UserId, Validators.required],
      ModifyUserId: [user.UserId, Validators.required],
      StatusId: [1, Validators.required],
    });
  }

  onSubmit(permission: Permission) {
    permission.Name = permission.Name.toLowerCase();
    // this.permissionService.addPermission(permission);
    this.routeTo.navigate([`/dashboard/role-details/${this.roleId}`]);
  }

}
