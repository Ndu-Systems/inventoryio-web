import { Component, OnInit } from '@angular/core';
import { BannerService, StoresService, AccountService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { Store, User, NotFoundModel } from 'src/app/_models';
import { Router } from '@angular/router';
import { StatusConstant, NotFoundConstants } from '../shared';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent implements OnInit {
  search: string;
  stores$: Observable<Store[]>;
  notFoundModel: NotFoundModel;
  showForm: boolean;
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
    this.notFoundModel = {
      Image: NotFoundConstants.NOT_FOUND_STORES.image,
      Message: NotFoundConstants.NOT_FOUND_STORES.message
    };
    this.bannerService.updateState({
      heading: 'Manage Stores',
      backto: '/dashboard/configurations'
    });
    this.stores$ = this.storeService.stores;
    this.storeService.getAllStores(user.CompanyId, StatusConstant.ACTIVE_STATUS);
    this.storeService.removeCurrentStore();

  }

  add() {
    this.routeTo.navigate(['dashboard/add-store']);
  }

  showAdd() {
    this.showForm = !this.showForm;
  }

  clearSearch() { this.search = null; }

}
