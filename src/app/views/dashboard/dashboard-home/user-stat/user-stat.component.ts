import { Component, OnInit } from '@angular/core';
import { UserStat, User, Product, Orders, Store } from 'src/app/_models';
import { AccountService, OrdersService, ProductService, StoresService, UsersService } from 'src/app/_services';
import { Router } from '@angular/router';
import { StatusConstant } from '../../shared';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-user-stat',
  templateUrl: './user-stat.component.html',
  styleUrls: ['./user-stat.component.scss']
})
export class UserStatComponent implements OnInit {
  stat: UserStat[] = [];
  user: User;
  users: User[] = [];
  products: Product[] = [];
  orders: Orders[] = [];
  stores: Store[] = [];
  today = new Date();

  statEmitter$ = new BehaviorSubject<UserStat[]>([]);

  constructor(
    private accountService: AccountService,
    private router: Router,
    private ordersService: OrdersService,
    private productService: ProductService,
    private storesService: StoresService,
    private usersService: UsersService,
  ) {
    this.user = this.accountService.currentUserValue;
    this.storesService.getAllStores(this.user.CompanyId, StatusConstant.ACTIVE_STATUS);
    this.usersService.getAllUsers(this.user.CompanyId, StatusConstant.ACTIVE_STATUS);
    this.storesService.stores.subscribe(data => {
      if (!data) { return false; }
      this.stores = data;
      this.pushStat({
        name: 'Your stores',
        value: this.stores.length,
        image: 'assets/images/stat-store.svg',
        link: 'dashboard/stores'
      });
    });
    this.usersService.users.subscribe(data => {
      if (!data) { return false; }
      this.users = data;
      this.pushStat({
        name: 'System users',
        value: this.users.length,
        image: 'assets/images/stat-users.svg',
        link: 'dashboard/users'
      });
    });
    this.ordersService.orders.subscribe(data => {
      if (!data) { return false; }
      this.orders = data;
      this.pushStat({
        name: 'Active orders',
        value: this.orders.length,
        image: 'assets/images/state-orders.svg',
        link: 'dashboard/list-orders'
      });
    });
    this.productService.products.subscribe(data => {
      if (!data) { return false; }
      this.products = data;
      this.pushStat({
        name: 'Inventory ',
        value: this.products.length,
        image: 'assets/images/stat-stock-and-hand.svg',
        link: 'dashboard/list-product'
      });
    });


  }

  ngOnInit() {

    this.user = this.usersService.currentUserValue;
    this.productService.getProducts(this.user.CompanyId);
    this.ordersService.getOrders(this.user.CompanyId);
    this.storesService.getAllStores(this.user.CompanyId, StatusConstant.ACTIVE_STATUS);
    this.usersService.getAllUsers(this.user.CompanyId, StatusConstant.ACTIVE_STATUS);

  }
  goto(link) {
    if (!link) { return false; }
    this.router.navigate([link]);
  }
  pushStat(data: UserStat) {
    if (!data.name) {
      return false;
    }

    this.stat = this.stat.filter(x => x.name !== data.name);
    this.stat.push(data);
    this.statEmitter$.next(this.stat);
  }
}
