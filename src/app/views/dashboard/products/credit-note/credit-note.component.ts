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
  total: number;
  finalTotal: number;
  companyTax: number;
  products: Product[];

  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private creditNoteService: CreditNoteService,
    private messageService: MessageService,
    private ordersService: OrdersService,
    private confirmationService: ConfirmationService,
    private productService: ProductService



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
      Total: [`-R ${this.order.Total}` || 0],
      Reason: [null, Validators.required],
      OtherReason: [null],
      Notes: [null],
      CompanyId: [this.order.CompanyId, Validators.required],
      CreateDate: [this.order.CreateDate, Validators.required],
      CreateUserId: [user.UserId, Validators.required],
      ModifyUserId: [user.UserId, Validators.required],
      StatusId: [1, Validators.required]
    });

    this.productService.products.subscribe(p => { this.products = p; });
    this.productService.getProducts(this.order.CompanyId);

    this.ordersService.order.subscribe(state => {
      if (!state) { return; }
      this.total = state.Total;
      this.finalTotal = Number(state.Total) + (state.Total * this.companyTax);
    });

  }


  onSubmit(creditNote: CreditNote) {
    if (creditNote.Reason === 'other') {
      if (creditNote.OtherReason) {
        creditNote.Reason = creditNote.OtherReason;
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Other reason is required!',
          detail: 'Please enter other reason to save'
        });
        return false;
      }
    }
    this.confirmationService.confirm({
      message: 'Are you sure that you want to cancel this order?',
      accept: () => {
        creditNote.Total = this.order.Total * -1;
        this.creditNoteService.addCreditNote(creditNote).subscribe(data => {
          console.log(data);
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Credit Note created '
          });
          this.order.Status = 'Cancelled';
          // this.ordersService.uptadeOrder(this.order);
          this.updateProductsRange();
          this.back();
        });
      }
    });

  }

  updateProductsRange() {
    const products: Product[] = [];
    this.order.Products.forEach(item => {
      const product = this.products.find(x => x.ProductId === item.ProductId);
      product.Quantity = Number(product.Quantity) + Number(item.Quantity);
      product.TrackInventory = true;
      products.push(product);
    });
    this.productService.updateProductRange(products);
  }
  back() {
    this.routeTo.navigate([`/dashboard/list-orders`]);
  }
}
