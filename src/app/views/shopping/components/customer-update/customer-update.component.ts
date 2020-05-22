import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { User, Role } from 'src/app/_models';
import { AccountService, UsersService, RolesService } from 'src/app/_services';
import { Router } from '@angular/router';
import { StatusConstant } from 'src/app/views/dashboard/shared';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-customer-update',
  templateUrl: './customer-update.component.html',
  styleUrls: ['./customer-update.component.scss']
})
export class CustomerUpdateComponent implements OnInit {

  rForm: FormGroup;
  staff: User;
  user: User;
  roles: Role[];
  shopPrimaryColor;
  shopSecondaryColor;
  logoUrl;
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private userService: UsersService,
    private messageService: MessageService,
    private roleService: RolesService,
    private routeTo: Router
  ) { }

  ngOnInit() {
    this.staff = this.accountService.getCurrentCustomer();
    this.user = this.accountService.getCurrentCustomer();
    if (this.user && this.user.UserId) {
      this.rForm = this.fb.group({
        UserId: [this.user.UserId],
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
        Address: [this.staff.Address],
        SecondaryContactNumber: [null],
        Password: [this.staff.Password],
        RoleId: [this.staff.RoleId, Validators.required],
        CompanyId: [this.staff.CompanyId, Validators.required],
        CreateUserId: [this.staff.UserId, Validators.required],
        ModifyUserId: [this.user.UserId, Validators.required],
        StatusId: [this.staff.StatusId, Validators.required],
      });
    }

  }



  update(staff: User) {
    this.userService.updateUserAysnc(staff).subscribe(data => {
      console.log(data);
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Your details was updated'
      });
      // this.routeTo.navigate(['dashboard/users']);
    });

  }
}
