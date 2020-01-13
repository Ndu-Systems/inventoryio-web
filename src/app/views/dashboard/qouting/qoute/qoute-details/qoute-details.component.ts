import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';
import { User, Email, Qoutation, QouteProducts } from 'src/app/_models';
import { AccountService, BannerService, EmailService, InvoiceService } from 'src/app/_services';
import { Router } from '@angular/router';
import { QoutationService } from 'src/app/_services/dashboard/qoutation.service';

@Component({
  selector: 'app-qoute-details',
  templateUrl: './qoute-details.component.html',
  styleUrls: ['./qoute-details.component.scss']
})
export class QouteDetailsComponent implements OnInit {

  search: string;
  order$: Observable<Qoutation>;
  products$: Observable<QouteProducts[]>;
  total: number;
  companyTax = 0.1;
  finalTotal: number;
  showPrint: boolean;
  amountPaid: number;
  user: User;

  constructor(
    private qoutationService: QoutationService,
    private router: Router,
    private accountService: AccountService,
    private bannerService: BannerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private emailService: EmailService,
    private invoiceService: InvoiceService,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (!this.user.UserId) { this.router.navigate(['sign-in']); }
    this.order$ = this.qoutationService.qoute;
    this.products$ = this.qoutationService.qouteProducts;

    this.bannerService.updateState({
      heading: 'Order Items',
      backto: '/dashboard/list-qoutation',
    });
    this.qoutationService.qoute.subscribe(state => {
      if (!state) { return; }
      this.qoutationService.getProductsForAnQoute(state.QuotationId);
      this.total = state.Total;
      this.finalTotal = Number(state.Total) + (state.Total * this.companyTax);
    });
  }
  add() {
    this.router.navigate(['/dashboard/qoute-customer']);
  }

  print(order: Qoutation) {
    const url = this.invoiceService.getQuotationURL(order.QuotationId);
    const win = window.open(url, '_blank');
    win.focus();
  }

  invoiceQuote(qoute: Qoutation) {
    //  create order

    // update quotation status to invoiced
    qoute.Status = 'Invoiced';
    qoute.StatusId = 2;
    this.qoutationService.uptadeQoute(qoute);
  }

  sendInvoice(order: Qoutation) {
    if (!order.Customer) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Customer details!',
        detail: 'This order have no customer details!',
        life: 7000
      });
      return false;
    }
    const downloadLink = this.invoiceService.getQuotationURL(order.QuotationId);
    const email: Email = {
      CompanyName: this.user.Company.Name,
      EmailType: '',
      Email: order.Customer && order.Customer.EmailAddress,
      ContactNumber: this.user.CellphoneNumber,
      Subject: `${this.user.Company.Name} Invoice to ${order.Customer && order.Customer.Name}`,
      Message: '',
      DownloadLink: downloadLink,
      InvoiceDate: this.formatDate(order.CreateDate),
      Customer: order.Customer && order.Customer.Name,
    };
    this.sendEmailNow(email);
  }
  sendEmailNow(email: Email) {
    this.emailService.sendEmailInvoice(email).subscribe(data => {
      console.log(data);
      this.messageService.add({
        severity: 'success',
        summary: `Invoice sent`,
        detail: 'Customer invoice was sent successful!'
      });
    });
  }

  formatDate(d: string) {
    const months = ['Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec'];

    const days = ['Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'];

    const date = new Date(d);

    return `${date.getDay()}  ${months[date.getMonth()]} ${date.getFullYear()}, ${days[date.getDay()]} `;
  }

}
