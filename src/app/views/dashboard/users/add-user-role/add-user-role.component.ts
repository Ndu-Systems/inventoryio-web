import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { User, Role, UserRoleModel } from 'src/app/_models';
import { RolesService, AccountService, UsersService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { StatusConstant } from '../../shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-user-role',
  templateUrl: './add-user-role.component.html',
  styleUrls: ['./add-user-role.component.scss']
})
export class AddUserRoleComponent implements OnInit {
  @Input() user: User;
  @Output() toggle = new EventEmitter<boolean>();
  roles: Role[];
  rForm: FormGroup;

  constructor(
    private roleService: RolesService,
    private routeTo: Router,
    private accountService: AccountService,
    private userService: UsersService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    const user: User = this.accountService.currentUserValue;
    if (!user) {
      this.accountService.logout();
      this.routeTo.navigate(['sign-in']);
    }

    this.getRoles(user.CompanyId);

    this.rForm = this.fb.group({
      UserId: [this.user.UserId, Validators.required],
      RoleId: [null, Validators.required],
      CreateUserId: [user.UserId, Validators.required],
      ModifyUserId: [user.UserId, Validators.required],
      StatusId: [1, Validators.required],
    });
  }

  getRoles(companyId: string) {
    this.roleService.getRolesForCompany(companyId, StatusConstant.ACTIVE_STATUS)
      .subscribe(response => {
        this.roles = response;
      });
  }

  onSubmit(userRole: UserRoleModel) {
    this.userService.addUserRole(userRole);
    this.messageService.add({
      severity: 'success',
      summary: 'Success.',
      detail: `role added successfully for ${this.user.Name}`
    });
    this.toggle.emit(false);
  }

}
