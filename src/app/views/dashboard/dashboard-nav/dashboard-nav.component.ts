import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavModel } from 'src/app/_models';
import { AccountService } from 'src/app/_services';

@Component({
  selector: 'app-dashboard-nav',
  templateUrl: './dashboard-nav.component.html',
  styleUrls: ['./dashboard-nav.component.scss']
})
export class DashboardNavComponent implements OnInit {
  models: NavModel[];
  profileModels: NavModel[];
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
      ,
      {
        Name: 'settings',
        Link: '/dashboard',
        Icon: 'settings'
      }
      ,
      {
        Name: 'profile',
        Link: '/dashboard',
        Icon: 'profile'
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
        Name: 'sign out',
        Link: '/',
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

}
