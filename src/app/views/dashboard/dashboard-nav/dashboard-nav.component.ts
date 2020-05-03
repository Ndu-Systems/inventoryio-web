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
  salesNavModels: NavModel[];
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
        Name: 'Overview',
        Link: '/dashboard/',
        Icon: `assets/images/dashboard-nav-icons/dashboard.svg`,
        ActiveIcon: `assets/images/dashboard-nav-icons/dashboard-white.svg`,
        showItem: true
      },
      {
        Name: 'Reports',
        Link: '/dashboard/reports',
        Icon: `assets/images/dashboard-nav-icons/reports.svg`,
        ActiveIcon: `assets/images/dashboard-nav-icons/reports-white.svg`,
      },
      {
        Name: 'Products',
        Link: '/dashboard/list-product',
        Icon: `assets/images/dashboard-nav-icons/products.svg`,
        ActiveIcon: `assets/images/dashboard-nav-icons/products-white.svg`,
        showItem: true,
        AddUrl: '/dashboard/add-product',
        SecondaryName: 'customer'
      },
      {
        Name: 'Customers',
        Link: '/dashboard/partners/customers',
        Icon: `assets/images/dashboard-nav-icons/group.svg`,
        ActiveIcon: `assets/images/dashboard-nav-icons/group-white.svg`,
        showItem: true,
        AddUrl: '/dashboard/add-partner/customers',
        SecondaryName: 'customer'
      },
      {
        Name: 'Sales invoices',
        Link: '/dashboard/list-orders',
        Icon: `assets/images/dashboard-nav-icons/sales.svg`,
        ActiveIcon: `assets/images/dashboard-nav-icons/sale-white.svg`,
        showItem: true,
        AddUrl: '/dashboard/sell'
      },
      {
        Name: 'Quotes',
        Link: '/dashboard/qoutes-list',
        Icon: `assets/images/dashboard-nav-icons/qoute.svg`,
        ActiveIcon: `assets/images/dashboard-nav-icons/qoute-white.svg`,
        showItem: true,
        AddUrl: '/dashboard/qoute-customer'
      },
      {
        Name: 'Purchaser Orders',
        Link: '/dashboard/purchase-orders-list',
        Icon: `assets/images/dashboard-nav-icons/purchase-order.svg`,
        ActiveIcon: `assets/images/dashboard-nav-icons/purchase-order-white.svg`,
        showItem: true,
        AddUrl: '/dashboard/new-purchase-order'
      },
      {
        Name: 'Settings',
        Link: '/dashboard/configurations',
        Icon: `assets/images/dashboard-nav-icons/settings.svg`,
        ActiveIcon: `assets/images/dashboard-nav-icons/settings-white.svg`,
        showItem: true
      },
      {
        Name: 'Support',
        Link: '/dashboard/support',
        Icon: `assets/images/dashboard-nav-icons/support.svg`,
        ActiveIcon: `assets/images/dashboard-nav-icons/support-white.svg`,
        showItem: true
      },
      {
        Name: 'Sign out',
        Link: '/',
        Icon: `assets/images/dashboard-nav-icons/power.svg`,
        showItem: true
      }
    ];
  }

  selectLink(item: NavModel, index: number, secondary = 0) {
    if (Number(secondary) === 1) {
      this.models.map(x => { x.ShowModal = undefined; x.Active = false, x.Style = {}; });
      this.models[index].Active = true;
      this.models[index].Style = { background: 'blue', color: 'white', 'border-radius': '5px' };
      item.ShowModal = false;

      return true;
    }
    if (item.AddUrl) {
      this.models.map(x => x.ShowModal = false);
      item.ShowModal = true;
    } else {
      this.models.map(x => { x.ShowModal = false; x.Active = false, x.Style = {} });
      this.models[index].Active = true;
      this.models[index].Style = { background: 'blue', color: 'white', 'border-radius': '5px' };
      this.routeTo.navigate([item.Link]);
    }
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
      if (data && data.length > 0) {
        this.rolePermissions = [];
        this.rolePermissions = data;
        this.canConfigure();
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
