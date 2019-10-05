import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavModel, User } from 'src/app/_models';
import { AccountService } from 'src/app/_services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard-nav',
  templateUrl: './dashboard-nav.component.html',
  styleUrls: ['./dashboard-nav.component.scss']
})
export class DashboardNavComponent implements OnInit {
  models: NavModel[];
  profileModels: NavModel[];
  profileMobileModels: NavModel[];
  showNav: boolean;
  user$: Observable<User> = this.accountService.user;
  constructor(
    private accountService: AccountService,
    private routeTo: Router
  ) { }

  ngOnInit() {
    this.populateSideNav();
    this.populateProfileNav();
  }

  populateSideNav() {
    this.models = [] = [
      {
        Name: 'dashboard',
        Link: '/dashboard',
        Icon: 'dashboard'

      },
      {
        Name: 'products',
        Link: '/dashboard/list-product',
        Icon: 'products'

      },
      {
        Name: 'sell',
        Link: '/dashboard/sell',
        Icon: 'sell'
      }
    ];
  }
  populateProfileNav() {
    this.profileModels = [] = [
      {
        Name: 'profile',
        Link: '/dashboard',
      },
      {
        Name: 'configuration',
        Link: '/dashboard/configurations',
        Icon: 'settings'
      }
    ];

    this.profileMobileModels = [] = [
      {
        Name: 'sign out',
        Link: '/',
        Icon: 'sign-out'
      }
    ];
  }

  linkEvent(profileItem: NavModel) {
    if (profileItem.Link === '/') {
      this.accountService.logout();
    }
  }

  navigateHome() {
    this.routeTo.navigate(['/dashboard']);
  }
  toggleNav() {
    this.showNav = !this.showNav;
  }

}
