import { Component, OnInit } from '@angular/core';
import { AccountService, BannerService } from 'src/app/_services';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  showMobileNav;
  constructor(
    private accountService: AccountService,
    private bannerService: BannerService,
  ) { }

  ngOnInit() {
    this.accountService.logout();
    this.bannerService.resetBannerState();
  }
  toggleNav() {
    this.showMobileNav = !this.showMobileNav
  }
}
