import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BannerService, RolesService, AccountService } from 'src/app/_services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, Role } from 'src/app/_models';
import { MessageService } from 'primeng/components/common/api';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {
  rForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private bannerService: BannerService,
    private roleService: RolesService,
    private accountService: AccountService,
    private messageService: MessageService,
    private routeTo: Router
  ) { }

  ngOnInit() {
    // get the user
    const user: User = this.accountService.currentUserValue;
    if (!user) {
      this.accountService.logout();
      this.routeTo.navigate(['sign-in']);
    }
    this.rForm = this.fb.group({
      Name: [null, Validators.required],
      CompanyId: [user.CompanyId, Validators.required],
      CreateUserId: [user.UserId, Validators.required],
      ModifyUserId: [user.UserId, Validators.required],
      StatusId: [1, Validators.required]
    });

    this.bannerService.updateState({
      heading: 'Add a role',
      backto: '/dashboard/roles'
    });
  }

  onSubmit(role: Role) {
    this.roleService.addRole(role);
    this.messageService.add({
      severity: 'success',
      summary: 'Success.',
      detail: `Role ${role.Name} added successfully`
    });
    this.routeTo.navigate(['/dashboard/roles']);
  }

}
