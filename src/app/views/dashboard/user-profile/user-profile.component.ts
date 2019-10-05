import { Component, OnInit } from '@angular/core';
import { BannerService, UsersService, AccountService } from 'src/app/_services';
import { Router } from '@angular/router';
import { User } from 'src/app/_models';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: User;
  constructor(
    private bannerService: BannerService,
    private userService: UsersService,
    private accountService: AccountService,
    private routeTo: Router
  ) { }

  ngOnInit() {
    this.user = this.userService.currentUserValue;
    if (!this.user) {
      this.accountService.logout();
      this.routeTo.navigate(['sign-in']);
    }
    this.bannerService.updateState({
      heading: 'Your Profile',
      backto: '/dashboard'
    });
  }

}
