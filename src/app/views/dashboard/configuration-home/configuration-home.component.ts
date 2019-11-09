import { Component, OnInit } from '@angular/core';
import { BannerService, AccountService } from 'src/app/_services';
import { UserActions } from 'src/app/_models';

@Component({
  selector: 'app-configuration-home',
  templateUrl: './configuration-home.component.html',
  styleUrls: ['./configuration-home.component.scss']
})
export class ConfigurationHomeComponent implements OnInit {
  actions: UserActions[] = [];
  actions2: UserActions[] = [];
  constructor(
    private bannerService: BannerService,
    private accountService: AccountService,
  ) {
    this.bannerService.updateState({
      heading: 'Configuration',
      backto: '/dashboard'
    });
  }

  ngOnInit() {
    this.accountService.checkSession();
    this.populateActions();
  }

  populateActions() {
    this.actions.push(
      {
        name: 'manage stores',
        image: 'assets/images/actions/shop.svg',
        link: 'dashboard/stores'
      },
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
      },
      {
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
  }
}
