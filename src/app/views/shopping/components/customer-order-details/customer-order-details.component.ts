import { Component, OnInit } from '@angular/core';
import { User, Orders } from 'src/app/_models';
import { AccountService, OrdersService } from 'src/app/_services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-order-details',
  templateUrl: './customer-order-details.component.html',
  styleUrls: ['./customer-order-details.component.scss']
})
export class CustomerOrderDetailsComponent implements OnInit {

  user: User;
  order: Orders;
  orderId: any;
  constructor(
    private accountService: AccountService,
    private ordersService: OrdersService,
    private activatedRoute: ActivatedRoute,

  ) {

    this.activatedRoute.params.subscribe(r => {
      this.orderId = r.id;
      this.ordersService.getOrderById(this.orderId).subscribe(data => {
        this.order = data;
        console.log(data);
      });
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;

  }

}
