import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models';
import { BannerService, AccountService } from 'src/app/_services';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/_services/dashboard/users.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {
  search: string;
  users: Observable<User[]>;
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
    this.users = this.userService.users;
    this.userService.getAllUsers(user.CompanyId);
  }

  add() {
    this.routeTo.navigate(['dashboard/add-user']);
  }

}
