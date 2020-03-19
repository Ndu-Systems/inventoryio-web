import { Component, OnInit } from '@angular/core';
import { UserStat, User, Product, Orders, Store, Partner } from 'src/app/_models';
import { AccountService, OrdersService, ProductService, StoresService, UsersService, PartnerService } from 'src/app/_services';
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
  customers: Partner[] = [];
  today = new Date();

  statEmitter$ = new BehaviorSubject<UserStat[]>([]);

  constructor(
    private accountService: AccountService,
    private router: Router,
    private ordersService: OrdersService,
    private productService: ProductService,
    private storesService: StoresService,
    private usersService: UsersService,
    private partnerService: PartnerService,
  ) {
    this.user = this.accountService.currentUserValue;
    this.storesService.getAllStores(this.user.CompanyId, StatusConstant.ACTIVE_STATUS);
    this.usersService.getAllUsers(this.user.CompanyId, StatusConstant.ACTIVE_STATUS);
    this.partnerService.getPartners(this.user.CompanyId);

    this.storesService.stores.subscribe(data => {
      if (!data) { return false; }
      this.stores = data;

      // this.pushStat({
      //   name: 'Your stores',
      //   value: this.stores.length,
      //   image: 'assets/images/stat-store.svg',
      //   link: 'dashboard/stores'
      // });
    });

    this.partnerService.partners.subscribe(data => {
      this.customers = data.filter(x => x.PartnerType === 'customer');
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

    this.pushStat({
      name: 'Customers',
      value: this.customers.length,
      image: 'assets/images/stat-store.svg',
      link: 'dashboard/partners/customers'
    });
    this.ordersService.orders.subscribe(data => {
      if (!data) { return false; }
      this.orders = data;
      this.pushStat({
        name: 'Sales Orders',
        value: this.orders.length,
        image: 'assets/images/state-orders.svg',
        link: 'dashboard/list-orders'
      });
    });
    this.productService.products.subscribe(data => {
      if (!data) { return false; }
      this.products = data;
      this.pushStat({
        name: 'Items ',
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
    const item = this.stat.find(x => x.name === data.name);
    if (item) {
      this.stat[this.stat.indexOf(item)].value = data.value;
    } else {
      this.stat.push(data);
    }
    // this.stat = this.stat.filter(x => x.name !== data.name);
    this.statEmitter$.next(this.stat);
  }
}
