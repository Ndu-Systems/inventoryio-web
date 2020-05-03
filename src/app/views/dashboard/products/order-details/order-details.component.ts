import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Orders, OrderProducts, Email, User } from 'src/app/_models';
import { OrdersService, AccountService, BannerService, EmailService, InvoiceService } from 'src/app/_services';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  search: string;
  order$: Observable<Orders>;
  order: Orders;
  products$: Observable<OrderProducts[]>;
  total: number;
  companyTax = 0.1;
  finalTotal: number;
  showPrint: boolean;
  paymentAction: boolean;
  amountPaid: number;
  user: User;
  prefix = 'INV';
  showDetials = true;
  error: string;

  constructor(
    private ordersService: OrdersService,
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
    this.order$ = this.ordersService.order;
    this.products$ = this.ordersService.orderProducts;

    this.bannerService.updateState({
      heading: 'Order Items',
      backto: '/dashboard/list-orders',
    });
    this.ordersService.order.subscribe(state => {
      if (!state) { return; }
      this.total = state.Total;
      this.finalTotal = Number(state.Total) + (state.Total * this.companyTax);
      this.showDetials = state.Show;
      this.order = state;
    });
  }
  add() {
    this.router.navigate(['/dashboard/sell']);
  }

  print(order: Orders) {
    // this.router.navigate(['/dashboard/print-invoice']);
    const url = this.invoiceService.getInvoiceURL(order.OrdersId);
    const win = window.open(url, '_blank');
    win.focus();
  }



  cancelPayAction() {
    this.paymentAction = false;
  }
  triggerPaymentAction() {
    this.paymentAction = true;
  }
  getStatus(order: Orders) {
    if (order.Due > 0) {
      return 'Partially paid';
    }
    return 'Fully paid';
  }
  savePayment(order: Orders) {
    order.Payment = this.amountPaid;
    if (!this.validatePaymentAmount(order)) {
      return false;
    }
    this.confirmationService.confirm({
      message: `The payment of R${this.amountPaid} will be processed , continue`,
      accept: () => {
        order.Paid = Number(order.Paid) + Number(order.Payment);
        order.Due = Number(order.Total) - Number(order.Paid);
        order.Status = this.getStatus(order);

        this.ordersService.uptadeOrder(order);
        this.messageService.add({
          severity: 'success',
          summary: `R ${order.Payment}`,
          detail: 'Payment successful!'
        });
        this.paymentAction = false;
        this.order$ = this.ordersService.order;
        this.amountPaid = undefined;
      }
    });

  }

  validatePaymentAmount(order: Orders) {
    if ((order.Total - order.Payment < 0) || Number(order.Due) <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Payment exceeded!',
        detail: 'Payment cannot be more the total amount',
        life: 7000
      });
      this.error = 'Payment cannot be more the total amount';
      return false;
    }
    return true;
  }
  sendInvoice(order: Orders) {
    const subject = 9;
    // const downloadLink = `${environment.BASE_URL}/#/download-invoice/${order.OrdersId}`;
    const downloadLink = this.invoiceService.getInvoiceURL(order.OrdersId);

    if (!order.Customer) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Customer details!',
        detail: 'This order have no customer details!',
        life: 7000
      });
      return false;
    }

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
  createCreditNote(order: Orders) {
    this.ordersService.updateOrderState(order);
    this.router.navigate(['/dashboard/credit-note']);
  }
  viewCreditNote(order: Orders) {
    const url = this.invoiceService.getCrediNoteURL(order.OrdersId);
    const win = window.open(url, '_blank');
    win.focus();
  }
  closeDetails() {
    this.order.Show = false;
    this.ordersService.updateOrderState(this.order);
  }
}
