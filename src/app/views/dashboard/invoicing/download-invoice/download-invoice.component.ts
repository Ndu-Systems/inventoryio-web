import { Component, OnInit } from '@angular/core';
import { OrdersService, AccountService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { OrderProducts, User, Orders } from 'src/app/_models';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Router, ActivatedRoute } from '@angular/router';
import { SplashHomeComponent } from '../../shared/splash-home/splash-home.component';
import { MessageService } from 'primeng/api';
import { SplashService } from 'src/app/_services/splash.service';

@Component({
  selector: 'app-download-invoice',
  templateUrl: './download-invoice.component.html',
  styleUrls: ['./download-invoice.component.scss']
})
export class DownloadInvoiceComponent implements OnInit {

  companyTax = 0.1;
  total = 0;
  InvoiceDate: string;
  InvoiceNumber: number;
  user: User;
  orderId: string;
  order: Orders;



  constructor(private ordersService: OrdersService,
    private router: Router,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private splashService: SplashService
  ) {

  }

  ngOnInit() {

    this.activatedRoute.params.subscribe(r => {
      this.orderId = r.id;
      // get totals 
      this.ordersService.getOrderById(this.orderId).subscribe(state => {
        if (!state) { return; }
        this.order = state;
        this.total = state.Total;
        this.InvoiceDate = state.CreateDate;
        this.InvoiceNumber = state.OrderId;
        setTimeout(() => {
          this.captureScreen();
          this.splashService.update({
            show: true, heading: 'Download complete',
            message: ' Your invoice was downloaded successfuly',
            class: `success`
          });
        }, 2000);
      });

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


}
