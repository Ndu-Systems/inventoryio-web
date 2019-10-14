import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models';
import { BannerService, AccountService, UsersService } from 'src/app/_services';
import { Router } from '@angular/router';
import { StatusConstant } from '../../shared';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {
  search: string;
  users$: Observable<User[]>;

  showForm: boolean;
  constructor(
    private bannerService: BannerService,
    private userService: UsersService,
    private accountService: AccountService,
    private routeTo: Router
  ) { }

  ngOnInit() {
    const user: User = this.accountService.currentUserValue;
    if (!user) {
      this.accountService.logout();
      this.routeTo.navigate(['sign-in']);
    }

    this.bannerService.updateState({
      heading: 'Manage Users',
      backto: '/dashboard/configurations'
    });
    this.users$ = this.userService.users;
    this.userService.getAllUsers(user.CompanyId, StatusConstant.ACTIVE_STATUS);
  }

  add() {
    this.routeTo.navigate(['dashboard/add-user']);
  }
  showAdd() {
    this.showForm = !this.showForm;
  }

}
