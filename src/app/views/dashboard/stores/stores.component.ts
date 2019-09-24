import { Component, OnInit } from '@angular/core';
import { BannerService, StoresService, AccountService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { Store, User } from 'src/app/_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent implements OnInit {
  search: string;
  stores: Observable<Store[]>;

  constructor(
    private bannerService: BannerService,
    private storeService: StoresService,
    private accountService: AccountService,
    private routeTo: Router
  ) { }

  ngOnInit() {
    const user: User = this.accountService.currentUserValue;
    if (!user) {
      this.accountService.logout();
      this.routeTo.navigate(['sign-in']);
    }

    this.bannerService.updateState({
      heading: 'Manage Stores',
      backto: '/dashboard/configurations'
    });
    this.stores = this.storeService.stores;
    this.storeService.getAllStores(user.CompanyId);
  }

  add() {
    this.routeTo.navigate(['dashboard/add-store']);
  }

}
