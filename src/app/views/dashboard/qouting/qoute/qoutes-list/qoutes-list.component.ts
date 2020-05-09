import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Orders, NotFoundModel, Qoutation } from 'src/app/_models';
import { OrdersService, AccountService, BannerService } from 'src/app/_services';
import { Router } from '@angular/router';
import { NotFoundConstants } from '../../../shared';
import { MessageService } from 'primeng/api';
import { QoutationService } from 'src/app/_services/dashboard/qoutation.service';

@Component({
  selector: 'app-qoutes-list',
  templateUrl: './qoutes-list.component.html',
  styleUrls: ['./qoutes-list.component.scss']
})
export class QoutesListComponent implements OnInit {

  search: string;
  paying: boolean;
  orders$: Observable<Orders[]>;
  showSearchOrder: any;
  notFoundModel: NotFoundModel;
  qoutations: Qoutation[];

  constructor(
    private qoutationService: QoutationService,
    private router: Router,
    private accountService: AccountService,
    private bannerService: BannerService,
    private messageService: MessageService,

  ) { }

  ngOnInit() {
    const user = this.accountService.currentUserValue;
    if (!user.UserId) { this.router.navigate(['sign-in']); }
    this.qoutationService.getQoutations(user.CompanyId);
    this.orders$ = this.qoutationService.qoutations;

    this.bannerService.updateState({
      heading: 'Orders',
      backto: '/dashboard',
    });
    this.qoutationService.getQoutations(user.CompanyId);
    this.notFoundModel = {
      Image: NotFoundConstants.NOT_FOUND_QUOTES.image,
      Message: NotFoundConstants.NOT_FOUND_QUOTES.message
    };
    this.qoutationService.qoutations.subscribe(data => {
      this.qoutations = data;
    });
  }
  add() {
    this.router.navigate(['/dashboard/qoute-customer']);
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

    this.qoutationService.uptadeQoute(order);
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
  select(qoute: Qoutation) {
    qoute.Show = true;
    this.qoutationService.updateQoutationState(qoute);
  }

}
