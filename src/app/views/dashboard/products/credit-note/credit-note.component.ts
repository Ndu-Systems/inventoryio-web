import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Brand, Caterory, Product, User, Orders } from 'src/app/_models';
import { Router } from '@angular/router';
import { AccountService, ProductService, BannerService, OrdersService } from 'src/app/_services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss']
})
export class CreditNoteComponent implements OnInit {

  rForm: FormGroup;
  error: string;
  prefix = 'ORD';
  order$: Observable<Orders>;
  order: Orders;

  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private productService: ProductService,
    private messageService: MessageService,
    private ordersService: OrdersService,



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
      OrderNo: [`${this.prefix}-${this.order.OrderId}` || ''],
      Total: [this.order.Total || 0],
      Reason: [null, Validators.required],
      CompanyId: [this.order.CompanyId, Validators.required],
      CreateDate: [this.order.CreateDate, Validators.required],
      CreateUserId: [user.UserId, Validators.required],
      ModifyUserId: [user.UserId, Validators.required],
      StatusId: [1, Validators.required]
    });

  }


  onSubmit(product: Product) {
    this.productService.addProduct(product);
    this.messageService.add({
      severity: 'success',
      summary: 'Success!',
      detail: 'product created '
    });

    this.routeTo.navigate([`/dashboard/list-product`]);

  }


  back() {
    this.routeTo.navigate([`/dashboard/list-orders`]);
  }
}
