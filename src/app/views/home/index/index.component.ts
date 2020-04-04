import { Component, OnInit } from '@angular/core';
import { AccountService, BannerService } from 'src/app/_services';
import { Title } from '@angular/platform-browser';

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
    private titleService: Title

  ) { }

  ngOnInit() {
    this.titleService.setTitle(`Inventory IO: Selling and buying platform`);

    this.accountService.logout();
    this.bannerService.resetBannerState();
  }
  toggleNav() {
    this.showMobileNav = !this.showMobileNav;
  }
}
