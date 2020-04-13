import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Orders, Product, User, OrderProducts } from 'src/app/_models';
import { Router } from '@angular/router';
import { AccountService, OrdersService, ProductService, SaleService } from 'src/app/_services';
import { CreditNoteService } from 'src/app/_services/dashboard/credit-note.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CreditNote } from 'src/app/_models/creditnote.model';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {

  supplier;
  notes;
  products: Product[];
  productRows: Product[] = [];
  user: User;

  constructor(
    private routeTo: Router,
    private accountService: AccountService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private productService: ProductService,
    private ordersService: OrdersService,
  ) {
  }

  ngOnInit() {

    this.user = this.accountService.currentUserValue;
    this.accountService.checkSession();

    this.productService.products.subscribe(p => { this.products = p; });
    this.productService.getProducts(this.user.CompanyId);

    this.addNewLine();

  }

  back() {
    this.routeTo.navigate([`/dashboard/list-orders`]);
  }

  addNewLine() {
    const prod: Product = {
      ProductId: new Date().getTime() + 'uiw',
      BrandId: '',
      CatergoryId: '',
      CompanyId: '',
      SupplierId: '',
      Name: `2l coke x 12`,
      Description: '',
      UnitPrice: null,
      UnitCost: 3500,
      Code: '',
      SKU: '',
      TrackInventory: true,
      Quantity: 1,
      LowStock: 0,
      CreateDate: '',
      CreateUserId: '',
      ModifyDate: '',
      ModifyUserId: '',
      StatusId: ''
    };
    this.productRows.push(prod);
  }
  removeItem(index) {
    this.productRows.splice(index);

  }
  blur() {

  }
  reduce(action, index) {
    if (action === -1 && this.productRows[index].Quantity <= 1) {
      return false;
    }
    this.productRows[index].Quantity = Number(this.productRows[index].Quantity) + Number(action);
  }

  onSubmit() {
    const products: OrderProducts[] = [];
    let subTot = 0;

    this.productRows.forEach(item => {
      products.push({
        OrderId: '0',
        ProductId: item.ProductId || 'new',
        CompanyId: this.user.CompanyId,
        ProductName: item.Name,
        UnitPrice: item.UnitCost,
        Quantity: item.Quantity,
        subTotal: Number(item.Quantity) * Number(item.UnitCost),
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: 1,
        Options: []
      });
      subTot += Number(item.Quantity) * Number(item.UnitCost);
    });

    const order: Orders = {
      CompanyId: this.user.CompanyId,
      ParntersId: null,
      OrderType: 'Purchase',
      Total: subTot,
      Paid: 0,
      Due: 0,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      Status: 'new',
      StatusId: 1,
      Charges: []
    };

    this.ordersService.addPurchaseOrder(order, products).subscribe(response => {
      console.log(response);
    });
  }


}
