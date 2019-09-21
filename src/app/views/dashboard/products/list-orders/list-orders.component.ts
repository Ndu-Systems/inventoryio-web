import { Component, OnInit } from '@angular/core';
import { OrderProducts, Product, Orders } from 'src/app/_models';
import { OrdersService, AccountService, BannerService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.scss']
})
export class ListOrdersComponent implements OnInit {

  search: string;
  orders$: Observable<Orders[]>;

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private accountService: AccountService,
    private bannerService: BannerService

  ) { }

  ngOnInit() {
    const user = this.accountService.currentUserValue;
    if (!user.UserId) { this.router.navigate(['sign-in']); }
    this.orders$ = this.ordersService.orders;

    this.bannerService.updateState({
      heading: 'Orders',
      backto: '/dashboard',
    });
    this.ordersService.getOrders(user.CompanyId);
  }
  add() {
    this.router.navigate(['/dashboard/sell']);
  }
  details(order: Orders) {
    this.ordersService.updateOrderState(order);
    this.ordersService.getProductsForAnOrder(order.OrdersId);
    this.router.navigate([`/dashboard/order-details`]);
  }
  onPay(order: Orders) {
    if ((order.Total - order.Paid < 0)) {
      this.payAll(order);
      order.Disable = true;
    //  order.Paid = order.Due;
      return;
    }
    order.Due = order.Total - order.Paid;
    console.log(order);

  }
  payAll(order: Orders) {
    if (!order.Due) {
      order.Due = order.Total;
    }
    order.Disable = false;
    order.Paid = order.Due;
    order.Due = 0;
  }
}
