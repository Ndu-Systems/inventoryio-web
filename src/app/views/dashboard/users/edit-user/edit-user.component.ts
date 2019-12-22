import { StatusConstant } from './../../shared/config';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { User, Role } from 'src/app/_models';
import { UsersService, AccountService, RolesService } from 'src/app/_services';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  rForm: FormGroup;
  staff: User;
  user: User;
  roles: Role[];
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private userService: UsersService,
    private messageService: MessageService,
    private roleService: RolesService,
    private routeTo: Router
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.getRoles(this.user.CompanyId);
    this.staff = this.userService.currentUserValue;
    this.initForm();

  }

  initForm() {
    this.rForm = this.fb.group({
      UserId: [this.staff.UserId],
      Email: new FormControl(
        this.staff.Email,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])
      ),
      Surname: [this.staff.Surname, Validators.required],
      Name: [this.staff.Name, Validators.required],
      CellphoneNumber: [this.staff.CellphoneNumber, Validators.required],
      SecondaryContactNumber: [null],
      Password: [this.staff.Password],
      RoleId: [this.staff.RoleId, Validators.required],
      CompanyId: [this.staff.CompanyId, Validators.required],
      CreateUserId: [this.staff.UserId, Validators.required],
      ModifyUserId: [this.user.UserId, Validators.required],
      StatusId: [this.staff.StatusId, Validators.required],
    });
  }

  getRoles(companyId: string) {
    this.roleService.getRolesForCompany(companyId, StatusConstant.ACTIVE_STATUS)
      .subscribe(response => {
        this.roles = response;
      });
  }

  update(staff: User) {
    this.userService.updateUser(staff);
    this.messageService.add({
      severity: 'success',
      summary: 'Success!',
      detail: 'Staff member updated'
    });
    this.routeTo.navigate(['dashboard/users']);
  }
}
