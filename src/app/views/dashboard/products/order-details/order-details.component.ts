import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Orders, OrderProducts, Email, User } from 'src/app/_models';
import { OrdersService, AccountService, BannerService, EmailService } from 'src/app/_services';
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
  products$: Observable<OrderProducts[]>;
  total: number;
  companyTax = 0.1;
  finalTotal: number;
  showPrint: boolean;
  paymentAction: boolean;
  amountPaid: number;
  user: User;

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private accountService: AccountService,
    private bannerService: BannerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private emailService: EmailService,

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
      this.ordersService.getProductsForAnOrder(state.OrdersId);
      this.total = state.Total;
      this.finalTotal = Number(state.Total) + (state.Total * this.companyTax);
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
  print() {
    this.router.navigate(['/dashboard/print-invoice']);
  }

  cancelPayAction() {
    this.paymentAction = false;
  }
  triggerPaymentAction() {
    this.paymentAction = true;
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
        order.Status = order.Status;

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
      return false;
    }
    return true;
  }
  sendInvoice(order: Orders) {
    const subject = 9;
    const downloadLink = `${environment.BASE_URL}/download-invoice/${order.OrdersId}}`;

    const email: Email = {
      CompanyName: this.user.Company.Name,
      EmailType: '',
      Email: this.user.Email,
      ContactNumber: this.user.CellphoneNumber,
      Subject: 'Invoice',
      Message: '',
      DownloadLink: downloadLink
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

}
