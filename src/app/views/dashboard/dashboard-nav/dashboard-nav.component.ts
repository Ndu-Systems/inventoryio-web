import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavModel, User } from 'src/app/_models';
import { AccountService } from 'src/app/_services';
import { faCoffee , faThermometer, faCartPlus} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard-nav',
  templateUrl: './dashboard-nav.component.html',
  styleUrls: ['./dashboard-nav.component.scss']
})
export class DashboardNavComponent implements OnInit {
  models: NavModel[];
  profileModels: NavModel[];
  profileMobileModels: NavModel[];
  showNav = true;
  width: number;

  // font awesome
  faCoffee = faCoffee;
  faThermometer = faThermometer;
  faCartPlus = faCartPlus;
  constructor(
    private accountService: AccountService,
    private routeTo: Router
  ) { }

  ngOnInit() {
    this.populateSideNav();
    this.populateProfileNav();
    this.getDeviceSize();
  }

  populateSideNav() {
    this.models = [] = [
      {
        Name: 'dashboard',
        Link: '/dashboard/',
        Icon: `pi pi-home`

      },
      {
        Name: 'products',
        Link: '/dashboard/list-product',
        Icon:  `pi pi-shopping-cart`

      },
      {
        Name: 'sell',
        Link: '/dashboard/sell',
        Icon: `pi pi-money-bill`
      }
    ];
  }
  populateProfileNav() {
    this.profileModels = [] = [
      {
        Name: 'configuration',
        Link: '/dashboard/configurations',
        Icon: `pi pi-cog`
      }
    ];

    this.profileMobileModels = [] = [
      {
        Name: 'sign out',
        Link: '/',
        Icon: ``
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
  onToggle(event) {
    this.showNav = !this.showNav;
  }
  getDeviceSize() {
    this.width = screen.width;
    console.log(this.width);

    if (this.width <= 720) {
      this.showNav = false;

    }
  }

}
