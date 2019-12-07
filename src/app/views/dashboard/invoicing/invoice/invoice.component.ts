import { Component, OnInit } from '@angular/core';
import { OrdersService, AccountService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { OrderProducts, User, Orders } from 'src/app/_models';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  products$: Observable<OrderProducts[]>;
  companyTax = 0.1;
  total = 0;
  InvoiceDate: string;
  InvoiceNumber: number;
  user: User;
  order$: Observable<Orders>;



  constructor(private ordersService: OrdersService, private router: Router, private accountService: AccountService
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.products$ = this.ordersService.orderProducts;
    this.order$ = this.ordersService.order;


    this.ordersService.order.subscribe(state => {
      if (!state) { return; }
      this.ordersService.getProductsForAnOrder(state.OrdersId);
      this.total = state.Total;
      this.InvoiceDate = state.CreateDate;
      this.InvoiceNumber = state.OrderId;
    });

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
      pdf.save(`${this.InvoiceNumber} INVOICE.pdf`);
    });
  }
  cancel() {
    this.router.navigate(['/dashboard/list-orders']);
  }
}
