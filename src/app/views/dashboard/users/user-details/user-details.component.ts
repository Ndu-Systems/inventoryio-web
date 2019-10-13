import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { BannerService, AccountService, UsersService } from 'src/app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/_models';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  userId: string;
  user: User;
  constructor(
    private bannerService: BannerService,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private userService: UsersService,
    private routeTo: Router
  ) { }

  ngOnInit() {
    const currentUser: User = this.accountService.currentUserValue;
    if (!currentUser) {
      this.accountService.logout();
      this.routeTo.navigate(['sign-in']);
    }
    this.activatedRoute.params.subscribe(r => {
      this.userId = r.id;
    });
    this.bannerService.updateState({
      heading: 'User Details',
      backto: '/dashboard/users'
    });
    if (this.userId) {
      this.getUser(this.userId);
    }
  }

  getUser(userId: string) {
    // this.user = this.userService.users
    //   .pipe(map(users => users.find(item => item.UserId === userId)));
    // this.userService.getById(userId);
    this.userService.getUserDetails(userId).subscribe(response => {
      if (response.UserId) {
        this.user = response;
      }
    });
  }


  getUserNow(user: User) {
    alert(JSON.stringify(user));
  }

}
