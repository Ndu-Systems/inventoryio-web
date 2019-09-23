import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, SellModel, Orders, User } from 'src/app/_models';
import { ProductService, AccountService, BannerService, SaleService, OrdersService } from 'src/app/_services';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})
export class SellComponent implements OnInit {

  search: string;
  products$: Observable<Product[]>;
  sale: SellModel;
  user: User;
  constructor(
    private productService: ProductService,
    private router: Router,
    private accountService: AccountService,
    private bannerService: BannerService,
    private saleService: SaleService,
    private messageService: MessageService,
    private ordersService: OrdersService

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (!this.user.UserId) { this.router.navigate(['sign-in']); }
    this.products$ = this.productService.products;
    this.productService.getProducts(this.user.CompanyId);

    this.productService.products.subscribe(state => {
      if (state) {
        this.bannerService.updateState({
          heading: 'My Products',
          backto: '/dashboard',
          countLabel: 'Total Products',
          count: state.length
        });
      }
    });
    this.saleService.sell.subscribe(state => {
      this.sale = state;
    });
  }
  add() {
    this.router.navigate(['/dashboard/add-product']);
  }
  doSell(product: Product) {
    if (this.sale) {
      const item = this.sale.items.find(x => x.prodcuId === product.ProductId);
      if (item) {
        item.quantity++;
        this.saleService.doSellLogic(item);
        return;
      }
    }

    this.productService.updateCurrentProduct(product);
    this.saleService.doSellLogic({ prodcuId: product.ProductId, name: product.Name, price: Number(product.UnitPrice), quantity: 1 });
  }
  clear() {
    this.saleService.clearState();
  }
  onSubmit() {
    if (!this.sale.total) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Empty cart',
        detail: 'Add items in the cart to continue'
      });
      return false;
    }
    this.ordersService.updateOrderState(null);
    const order: Orders = {
      OrderId: this.getOrder(),
      CompanyId: this.user.CompanyId,
      ParntersId: '',
      OrderType: 'Sell',
      Total: this.sale.total,
      Paid: 0,
      Due: this.sale.total,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    };
    console.log(order);
    console.log('items', this.sale.items);
    this.ordersService.addOrder(order, this.sale.items);
    // clear state
    this.saleService.clearState();
    this.ordersService.updateOrderState(null);
    this.ordersService.updateOrderProductsState(null);
    this.router.navigate(['/dashboard/list-orders']);
  }
  getOrder(): string {
    const orderNumber = `O22`;
    return orderNumber;
  }
}
