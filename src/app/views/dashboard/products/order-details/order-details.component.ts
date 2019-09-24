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
  total: number;
  companyTax = 0.1;
  finalTotal: number;
  showPrint:boolean;

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private accountService: AccountService,
    private bannerService: BannerService

  ) { }

  ngOnInit() {
    const user = this.accountService.currentUserValue;
    if (!user.UserId) { this.router.navigate(['sign-in']); }
    this.order$ = this.ordersService.order;
    this.products$ = this.ordersService.orderProducts;

    this.bannerService.updateState({
      heading: 'Order Items',
      backto: '/dashboard/list-orders',
    });
    this.ordersService.order.subscribe(state => {
      if (!state) { return; }
      this.ordersService.getProductsForAnOrder(state.OrdersId);
      this.total = state.Total;
      this.finalTotal =  Number(state.Total) + (state.Total * this.companyTax);
    });
  }
  add() {
    this.router.navigate(['/dashboard/sell']);
  }
  details(order: Orders) {
    this.ordersService.updateOrderState(order);
    this.ordersService.getProductsForAnOrder(order.OrdersId);
    this.router.navigate([`/dashboard/order-details`]);
  } 
  print(){
    this.router.navigate(['/dashboard/print-invoice']);
  }
}
