import { Component, OnInit } from '@angular/core';
import { BannerService } from 'src/app/_services';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  search: string;
  constructor(
    private bannerService: BannerService
  ) {
    this.bannerService.updateState({
      heading: 'Manage Roles',
      backto: '/dashboard/configurations'
    });
  }

  ngOnInit() {
  }

}
