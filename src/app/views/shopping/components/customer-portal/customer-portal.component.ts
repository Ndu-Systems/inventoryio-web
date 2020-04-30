import { Component, OnInit } from '@angular/core';
import { AccountService, OrdersService } from 'src/app/_services';
import { User, Orders } from 'src/app/_models';

@Component({
  selector: 'app-customer-portal',
  templateUrl: './customer-portal.component.html',
  styleUrls: ['./customer-portal.component.scss']
})
export class CustomerPortalComponent implements OnInit {
  user: User;
  orders: Orders[];
  constructor(
    private accountService: AccountService,
    private ordersService: OrdersService,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.ordersService.getOrdersByEmail(this.user.Email).subscribe(data => {
      this.orders = data;
    });
  }

}
