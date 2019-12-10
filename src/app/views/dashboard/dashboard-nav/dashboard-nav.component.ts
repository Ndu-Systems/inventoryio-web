import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavModel, User, Role, Permission } from 'src/app/_models';
import { AccountService, RolesService } from 'src/app/_services';
import { faCoffee, faThermometer, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { SharedService } from '../shared/shared.service';

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
  show: boolean;
  role: Role;
  rolePermissions: Permission[] = [];

  // font awesome
  faCoffee = faCoffee;
  faThermometer = faThermometer;
  faCartPlus = faCartPlus;
  configRight: boolean;
  constructor(
    private accountService: AccountService,
    private routeTo: Router,
    private roleService: RolesService,
    private sharedService: SharedService
  ) {


  }

  ngOnInit() {
    const user: User = this.accountService.currentUserValue;
    this.getUserRole(user);
    this.getDeviceSize();
    this.populateSideNav();
  }

  populateSideNav() {
    this.models = [] = [
      {
        Name: 'dashboard',
        Link: '/dashboard/',
        Icon: `pi pi-home`,
        showItem: true
      },
      {
        Name: 'inventory ',
        Link: '/dashboard/list-product',
        Icon: `pi pi-shopping-cart`,
        showItem: true
      },
      {
        Name: 'sell',
        Link: '/dashboard/sell',
        Icon: `pi pi-money-bill`,
        showItem: true
      },
      {
        Name: 'sales orders',
        Link: '/dashboard/list-orders',
        Icon: `pi pi-align-left`,
        showItem: true
      },

      {
        Name: 'configuration',
        Link: '/dashboard/configurations',
        Icon: `pi pi-cog`,
        showItem: this.configRight
      },
      {
        Name: 'Reports',
        Link: '/dashboard/reports',
        Icon: `pi pi-chart-line`
      }
    ];
  }
  populateProfileNav() {
    this.profileModels = [] = [

      {
        Name: 'configuration',
        Link: '/dashboard/configurations',
        Icon: `pi pi-cog`,
        showItem: this.configRight
      },
      {
        Name: 'support',
        Link: '/dashboard/support',
        Icon: `pi pi-comments`,
        showItem: this.configRight
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

  getUserRole(user: User) {
    this.getRolePermissions(user.RoleId);
  }

  getRolePermissions(roleId: string | number) {
    this.roleService.getRolePermissions(roleId).subscribe(data => {
      if (data.length > 0) {
        this.rolePermissions = [];
        this.rolePermissions = data;
        this.canConfigure();
        this.populateProfileNav();

      }
    });
  }

  // Can access permissions
  canConfigure(): boolean {
    const configurePermissions = this.sharedService.loadConfigurationPermissions();
    this.configRight = false;
    let found = 0;
    configurePermissions.forEach((item) => {
      if (this.rolePermissions.length > 0) {
        this.rolePermissions.forEach((x) => {
          if (item.key.toLowerCase() === x.Name) {
            found++;
          }
        });
        if (found > 0) {
          this.configRight = true;
        }
      }
    });
    console.log(this.configRight);
    return this.configRight;
  }

  signOut() {
    this.accountService.logout();
    this.roleService.getRole(null);
  }

}
