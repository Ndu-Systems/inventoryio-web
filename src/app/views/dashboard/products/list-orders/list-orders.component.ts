import { Component, OnInit } from '@angular/core';
import { OrderProducts, Product, Orders, NotFoundModel, Caterory } from 'src/app/_models';
import { OrdersService, AccountService, BannerService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { NotFoundConstants } from '../../shared';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.scss']
})
export class ListOrdersComponent implements OnInit {

  search: string;
  paying: boolean;
  orders$: Observable<Orders[]>;
  showSearchOrder: any;
  notFoundModel: NotFoundModel;
  searchByCatergory = '';
  statuses: string[];

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private accountService: AccountService,
    private bannerService: BannerService,
    private messageService: MessageService,

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
    this.notFoundModel = {
      Image: NotFoundConstants.NOT_FOUND_ORDERS.image,
      Message: NotFoundConstants.NOT_FOUND_ORDERS.message
    };
    this.ordersService.orders.subscribe(data => {
      this.statuses = this.cleanStatus(data.map(x => x.Status));
    });
  }
  add() {
    this.router.navigate(['/dashboard/sell']);
  }
  cleanStatus(array: string[]) {
    const data = [];
    array.forEach(item => {
      if (!data.find(x => x === item)) {
        data.push(item);
      }
    });
    return data;
  }
  searchOrder() {
    this.showSearchOrder = !this.showSearchOrder;
  }
  onPay(order: Orders) {
    if ((order.Total - order.Payment < 0) || Number(order.Due) < 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sorry!',
        detail: 'Payment more that total amount'
      });
      order.Disable = true;
    } else {
      order.Disable = false;
      order.Due = order.Total - order.Payment;
      order.Due = order.Due - order.Paid;
      console.log(order);
    }


  }
  payAll(order: Orders) {
    order.Disable = false;
    order.Payment = order.Due;
    // order.Due = 0;
    this.pay(order);
  }
  updateOrder(order: Orders) {
    order.Paid = Number(order.Paid) + Number(order.Payment);
    order.Due = Number(order.Total) - Number(order.Paid);
    order.Status = order.Status;

    this.ordersService.uptadeOrder(order);
    this.pay(order);
    this.messageService.add({
      severity: 'success',
      summary: `R ${order.Payment}`,
      detail: 'Payment successful!'
    });
  }
  pay(order: Orders) {
    order.Paying = !order.Paying;
  }
  clearSearch() {
    this.search = null;
    this.searchOrder();
  }
  select(order: Orders) {
    // order.CardClass.push('card-active');
    this.ordersService.updateOrderState(order);
    this.ordersService.getProductsForAnOrder(order.OrdersId);
  }
}
