import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Brand, Caterory, Product, User, Orders } from 'src/app/_models';
import { Router } from '@angular/router';
import { AccountService, ProductService, BannerService, OrdersService } from 'src/app/_services';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CreditNoteService } from 'src/app/_services/dashboard/credit-note.service';
import { CreditNote } from 'src/app/_models/creditnote.model';

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss']
})
export class CreditNoteComponent implements OnInit {

  rForm: FormGroup;
  error: string;
  prefix = 'INV';
  order$: Observable<Orders>;
  order: Orders;

  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private creditNoteService: CreditNoteService,
    private messageService: MessageService,
    private ordersService: OrdersService,
    private confirmationService: ConfirmationService,



  ) {
  }

  ngOnInit() {

    const user: User = this.accountService.currentUserValue;
    this.accountService.checkSession();
    this.order$ = this.ordersService.order;
    this.order$.subscribe(order => {
      this.order = order;
    });

    this.rForm = this.fb.group({
      OrderId: [this.order.OrdersId || ''],
      OrderNo: [`${this.prefix}${this.order.OrderId}` || ''],
      Total: [this.order.Total || 0],
      Reason: [null, Validators.required],
      CompanyId: [this.order.CompanyId, Validators.required],
      CreateDate: [this.order.CreateDate, Validators.required],
      CreateUserId: [user.UserId, Validators.required],
      ModifyUserId: [user.UserId, Validators.required],
      StatusId: [1, Validators.required]
    });

  }


  onSubmit(creditNote: CreditNote) {

    this.confirmationService.confirm({
      message: 'Are you sure that you want to cancel this order?',
      accept: () => {
        this.creditNoteService.addCreditNote(creditNote).subscribe(data => {
          console.log(data);
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Credit Note created '
          });
          this.order.Status = 'Cancelled';
          this.ordersService.uptadeOrder(this.order);
          this.back();
        });
      }
    });

  }


  back() {
    this.routeTo.navigate([`/dashboard/list-orders`]);
  }
}
