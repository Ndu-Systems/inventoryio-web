import { Component, OnInit } from '@angular/core';
import { BannerService, AccountService } from 'src/app/_services';
import { UserActions, User } from 'src/app/_models';
import { ConfigService } from 'src/app/_services/dashboard/config.service';

@Component({
  selector: 'app-configuration-home',
  templateUrl: './configuration-home.component.html',
  styleUrls: ['./configuration-home.component.scss']
})
export class ConfigurationHomeComponent implements OnInit {
  actions: UserActions[] = [];
  actions2: UserActions[] = [];
  partners: UserActions[] = [];
  invoices: UserActions[] = [];
  shops: UserActions[] = [];
  user: User;
  constructor(
    private bannerService: BannerService,
    private accountService: AccountService,
    private configService: ConfigService,
  ) {
    this.bannerService.updateState({
      heading: 'Configuration',
      backto: '/dashboard'
    });
  }

  ngOnInit() {
    this.accountService.checkSession();
    this.user = this.accountService.currentUserValue;
    this.populateActions();
    this.configService.getConfigs(this.user.CompanyId);

  }

  populateActions() {
    this.actions.push(
      // {
      //   name: 'manage stores',
      //   image: 'assets/images/actions/shop.svg',
      //   link: 'dashboard/stores'
      // },
      {
        name: 'manage staff',
        image: 'assets/images/actions/staff.svg',
        link: 'dashboard/users'
      },
      {
        name: 'manage brands',
        image: 'assets/images/actions/brands.svg',
        link: 'dashboard/list-brands'
      },
      {
        name: 'manage categories',
        image: 'assets/images/actions/maintenance.svg',
        link: 'dashboard/list-categories'
      }

    );
    this.actions2.push({
      name: 'manage roles',
      image: 'assets/images/actions/role.svg',
      link: 'dashboard/roles'
    },
      {
        name: 'permissions',
        image: 'assets/images/actions/permission.svg',
        link: 'dashboard/permissions'
      }
    );

    this.partners.push({
      name: 'manage customers',
      image: 'assets/images/actions/cutomer.svg',
      link: 'dashboard/partners/customers'
    },
      {
        name: 'manage suppliers',
        image: 'assets/images/actions/suplier.svg',
        link: 'dashboard/partners/suppliers'
      }
    );

    this.invoices.push({
      name: 'banking details',
      image: 'assets/images/actions/save-money.svg',
      link: 'dashboard/company-view-configs/bank-details'
    },
      {
        name: 'address details',
        image: 'assets/images/actions/companyaddress.svg',
        link: 'dashboard/company-view-configs/address-details'
      },
      {
        name: 'Logo and colors',
        image: 'assets/images/actions/logo-and-colors.svg',
        link: 'dashboard/company-view-configs/logo-and-colors'
      }
    );
    this.shops.push(
      {
        name: 'Shop cover image & colors',
        image: 'assets/images/actions/shop.svg',
        link: 'dashboard/company-view-configs/shop'
      },
      {
        name: 'Shipping Methods',
        image: 'assets/images/actions/shop.svg',
        link: 'dashboard/company-view-configs/shipping'
      }
    );
  }
}
