import { Component, OnInit } from '@angular/core';
import { UserStat, User, Product, Orders, Store } from 'src/app/_models';
import { AccountService, OrdersService, ProductService, StoresService, UsersService } from 'src/app/_services';
import { Router } from '@angular/router';
import { StatusConstant } from '../../shared';

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

    this.usersService.users.subscribe(data => {
      if (!data) { return false; }
      this.users = data;
    });
    this.ordersService.orders.subscribe(data => {
      if (!data) { return false; }
      this.orders = data;
    });
    this.productService.products.subscribe(data => {
      if (!data) { return false; }
      this.products = data;
    });
    this.storesService.stores.subscribe(data => {
      if (!data) { return false; }
      this.stores = data;
    });
  }

  ngOnInit() {

    this.user = this.usersService.currentUserValue;
    this.productService.getProducts(this.user.CompanyId);
    this.ordersService.getOrders(this.user.CompanyId);
    this.storesService.getAllStores(this.user.CompanyId, StatusConstant.ACTIVE_STATUS);
    this.usersService.getAllUsers(this.user.CompanyId, StatusConstant.ACTIVE_STATUS);
    if (this.user) {
      this.stat.push({
        name: 'System users',
        value: this.users.length,
        image: 'assets/images/stat-users.svg',
        link: 'dashboard/users'
      });
      this.stat.push({
        name: 'Your stores',
        value: this.stores.length,
        image: 'assets/images/stat-store.svg',
        link: 'dashboard/stores'
      });
      this.stat.push({
        name: 'Active orders',
        value: this.orders.length,
        image: 'assets/images/state-orders.svg',
        link: 'dashboard/list-orders'
      });
      this.stat.push({
        name: 'Inventory ',
        value: this.products.length,
        image: 'assets/images/stat-stock-and-hand.svg',
        link: 'dashboard/list-product'
      });
    }
  }
  goto(link) {
    if (!link) { return false; }
    this.router.navigate([link]);
  }
}
