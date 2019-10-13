import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BannerService, UsersService, AccountService, RolesService} from 'src/app/_services';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User, Role } from 'src/app/_models';
import { DEFAULT_PASSWORD, StatusConstant } from '../../shared';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/components/common/api';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  @Output() showForm: EventEmitter<boolean> = new EventEmitter<boolean>();
  rForm: FormGroup;
  userAdded: User;
  roles: Role[];
  constructor(
    private fb: FormBuilder,
    private bannerService: BannerService,
    private userService: UsersService,
    private accountService: AccountService,
    private messageService: MessageService,
    private roleService: RolesService,
    private routeTo: Router
  ) { }

  ngOnInit() {
    const user: User = this.accountService.currentUserValue;
    this.getRoles(user.CompanyId);
    this.rForm = this.fb.group({
      Email: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])
      ),
      Surname: [null, Validators.required],
      Name: [null, Validators.required],
      CellphoneNumber: [null, Validators.required],
      Password: [DEFAULT_PASSWORD],
      RoleId: [null, Validators.required],
      CompanyId: [user.CompanyId, Validators.required],
      CreateUserId: [user.UserId, Validators.required],
      ModifyUserId: [user.UserId, Validators.required],
      StatusId: [StatusConstant.ACTIVE_STATUS, Validators.required]
    });
    this.bannerService.updateState({
      heading: 'Add a user',
      backto: '/dashboard/users'
    });
  }
  getRoles(companyId: string) {
    this.roleService.getRolesForCompany(companyId, StatusConstant.ACTIVE_STATUS)
      .subscribe(response => {
        this.roles = response;
      });
  }
  onSubmit(user: User) {
    this.userService.addSystemUser(user);
    this.messageService.add({
      severity: 'success',
      summary: 'Success.',
      detail: `User ${user.Name} added successfully`
    });
    this.routeTo.navigate(['dashboard/users']);
    this.showForm.emit(false);
  }

}
