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
    private accountService: AccountService
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

      },
      {
        Name: 'products',
        Link: '/dashboard/list-product',

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
        Name: 'logout',
        Link: '/',
      }
    ];
  }

  linkEvent(profileItem: NavModel) {
    if (profileItem.Name === 'logout') {
      this.accountService.logout();
    }
  }

}
