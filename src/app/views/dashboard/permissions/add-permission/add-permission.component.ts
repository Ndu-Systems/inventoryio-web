import { Component, OnInit, Input } from '@angular/core';
import { BannerService, PermissionsService, AccountService } from 'src/app/_services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService } from '../../shared/shared.service';
import { SystemPermissionModel, User, Permission } from 'src/app/_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add-permission.component.html',
  styleUrls: ['./add-permission.component.scss']
})
export class AddPermissionComponent implements OnInit {
  rForm: FormGroup;
  systemPermissions: SystemPermissionModel[] = [];
  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private bannerService: BannerService,
    private permissionService: PermissionsService,
    private accountService: AccountService,
    private sharedService: SharedService
  ) {
    this.bannerService.updateState({
      heading: 'Add Permission',
      backto: '/dashboard/permissions'
    });
  }

  ngOnInit() {
    this.systemPermissions = this.sharedService.loadSystemPermissions();
    const user: User = this.accountService.currentUserValue;
    if (!user) {
      this.accountService.logout();
      this.routeTo.navigate(['sign-in']);
    }
    this.rForm = this.fb.group({
      Name: [null, Validators.required],
      CompanyId: [user.CompanyId],
      CreateUserId: [user.UserId, Validators.required],
      ModifyUserId: [user.UserId, Validators.required],
      StatusId: [1, Validators.required],
    });
  }

  onSubmit(permission: SystemPermissionModel) {
    const addPermission: Permission = {
      Name: permission.Name.toLowerCase(),
      CompanyId: permission.CompanyId,
      CreateUserId: permission.CreateUserId,
      ModifyUserId: permission.ModifyUserId,
      StatusId: '1'
    };
    this.permissionService.addPermission(addPermission);
    this.routeTo.navigate(['/dashboard/permissions']);
  }

}
