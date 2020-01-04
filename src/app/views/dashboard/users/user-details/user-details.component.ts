import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { BannerService, AccountService, UsersService, RolesService } from 'src/app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { User, Role } from 'src/app/_models';
import { STAFF } from 'src/app/_shared';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  userId: string;
  user: User;
  role: Role;
  constructor(
    private bannerService: BannerService,
    private activatedRoute: ActivatedRoute,
    private roleService: RolesService,
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
    this.getCompanyRoles();
  }

  getUser(userId: string) {
    // this.user = this.userService.users
    //   .pipe(map(users => users.find(item => item.UserId === userId)));
    // this.userService.getById(userId);
    this.userService.getUserDetails(userId).subscribe(response => {
      if (response.UserId) {
        this.user = response;
        this.role = this.user.Role;
      }
    });

  }
  getCompanyRoles() {
    if (this.user) {
      this.roleService.getRolesForCompany(this.user.CompanyId, '1').subscribe(Response => {
        if (Response.length === 0) {
          // alert('do work');
        }
      });
    }
  }

  updateUser(user: User) {
    this.userService.updateUserState(user, STAFF);
    this.routeTo.navigate(['/dashboard/edit-user']);
  }
  onChange(event) { }
}
