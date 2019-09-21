import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Orders, OrderProducts } from 'src/app/_models';
import { OrdersService, AccountService, BannerService } from 'src/app/_services';
import { Router } from '@angular/router';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

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
      heading: 'Order details',
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
  public captureScreen() {
    const data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('MYPdf.pdf');
    });
  }
}
