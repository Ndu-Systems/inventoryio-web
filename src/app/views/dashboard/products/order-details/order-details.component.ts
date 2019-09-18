import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Orders, OrderProducts } from 'src/app/_models';
import { OrdersService, AccountService, BannerService } from 'src/app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  search: string;
  order$: Observable<Orders>;
  products$: Observable<OrderProducts[]>;

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private accountService: AccountService,
    private bannerService: BannerService

  ) { }

  ngOnInit() {
    const user = this.accountService.currentUserValue;
    if (!user.CompanyId) { this.router.navigate(['sign-in']); }
    this.order$ = this.ordersService.order;
    this.products$ = this.ordersService.orderProducts;

    this.bannerService.updateState({
      heading: 'Order details',
      backto: '/dashboard/list-orders',
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

}
