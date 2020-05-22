import { Component, OnInit } from '@angular/core';
import { User, Orders } from 'src/app/_models';
import { AccountService, OrdersService } from 'src/app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.scss']
})
export class CustomerOrdersComponent implements OnInit {

  user: User;
  orders: Orders[];
  shopSecondaryColor;
  shopPrimaryColor;
  logoUrl;
  constructor(
    private accountService: AccountService,
    private ordersService: OrdersService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.getCurrentCustomer();
    if (this.user && this.user.Email) {
      this.ordersService.getOrdersByEmail(this.user.Email).subscribe(data => {
        this.orders = data;
      });

    }

  }

  details(item: Orders) {
    this.router.navigate(['shop/customer-order-details', item.OrdersId]);
  }

}
