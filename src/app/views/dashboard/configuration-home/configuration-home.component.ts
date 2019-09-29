import { Component, OnInit } from '@angular/core';
import { BannerService } from 'src/app/_services';
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
    private bannerService: BannerService
  ) {
    this.bannerService.updateState({
      heading: 'Configuration',
      backto: '/dashboard'
    });
  }

  ngOnInit() {
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
      name: 'manage brands',
      image: 'assets/images/actions/brands.svg',
      link: 'dashboard/list-brands'
    },
      {
      name: 'manage categories',
      image: 'assets/images/actions/maintenance.svg',
      link: 'dashboard/list-categories'
    },
    // {
    //   name: 'manage clients',
    //   image: 'assets/images/actions/clients.svg',
    //   link: 'dashboard/configurations'
    // },
    // {
    //   name: 'manage suppliers',
    //   image: 'assets/images/actions/inventory.svg',
    //   link: 'dashboard/configurations'
    // },
    {
      name: 'manage staff',
      image: 'assets/images/actions/staff.svg',
      link: 'dashboard/users'
    });
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
