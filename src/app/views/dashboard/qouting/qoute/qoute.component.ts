import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, SellModel, User, NotFoundModel, Partner, Orders, Item } from 'src/app/_models';
import { ProductService, AccountService, BannerService, SaleService, PartnerService } from 'src/app/_services';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NotFoundConstants } from '../../shared';
import { QoutationService } from 'src/app/_services/dashboard/qoutation.service';

@Component({
  selector: 'app-qoute',
  templateUrl: './qoute.component.html',
  styleUrls: ['./qoute.component.scss']
})
export class QouteComponent implements OnInit {
  search: string;
  products$: Observable<Product[]>;
  sale: SellModel;
  user: User;
  products: Product[];
  categories: string[] = [];
  showCart = true;
  searchByCatergory;
  width: number;
  notFoundModel: NotFoundModel;
  // results = [];

  selectedCustomerId = '';
  customers: Partner[] = [];
  customers$: Observable<Array<Partner>>;

  constructor(
    private productService: ProductService,
    private router: Router,
    private accountService: AccountService,
    private bannerService: BannerService,
    private saleService: SaleService,
    private messageService: MessageService,
    private qoutationService: QoutationService,
    private partnerService: PartnerService


  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.accountService.checkSession();
    this.productService.getProducts(this.user.CompanyId);
    this.products$ = this.productService.products;
    this.productService.products.subscribe(data => {
      this.products = data;
      this.getDeviceSize();
      const categories = data.map(c => c.Catergory && c.Catergory.Name || '') || [];
      this.categories = categories.filter((item, index) => categories.indexOf(item) === index);
      this.categories = this.categories.filter(c => c !== '' && c !== undefined && c !== null);
    });


    this.saleService.sell.subscribe(state => {
      this.sale = state;
    });

    this.notFoundModel = {
      Image: NotFoundConstants.NOT_FOUND_SALES.image,
      Message: NotFoundConstants.NOT_FOUND_SALES.message
    };
    this.partnerService.getPartners(this.user.CompanyId);
    this.partnerService.partners.subscribe(data => {
      this.customers = data;
    });
    this.customers$ = this.partnerService.partners;
  }
  add() {
    this.router.navigate(['/dashboard/add-product']);
  }
  doSell(product: Product) {
    if (this.sale) {
      if ((product.QuantityAvailable <= 0) || (Number(product.Quantity) <= 0)) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Stock Alert.',
          detail: `You have run out of  ${product.Name}`
        });
        return false;
      }
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
    this.qoutationService.updateQoutationState(null);
    const order: Orders = {
      CompanyId: this.user.CompanyId,
      ParntersId: this.selectedCustomerId,
      OrderType: 'Sell',
      Total: this.sale.total,
      Paid: 0,
      Due: this.sale.total,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      Status: 'new',
      StatusId: 1
    };
    console.log(order);
    console.log('items', this.sale.items);
    this.qoutationService.addQoute(order, this.sale.items);
    // this.updateProductsRange(this.sale.items);  do no do stock adjusment
    // clear state
    this.saleService.clearState();
    this.qoutationService.updateQoutationState(null);
    this.qoutationService.updateQouteProductsState(null);
    this.router.navigate(['/dashboard/qoutes-list']);
  }

  updateProductsRange(items: Item[]) {
    const products: Product[] = [];
    items.forEach(item => {
      const product = this.products.find(x => x.ProductId === item.prodcuId);
      product.Quantity = Number(product.Quantity) - Number(item.quantity);
      products.push(product);
    });
    this.productService.updateProductRange(products);
  }
  details(product: Product) {
    this.productService.updateCurrentProduct(product);
    this.bannerService.updateState({
      backto: '/dashboard/sell',
    });
    this.router.navigate([`/dashboard/product-details`]);
  }
  clearSearch() {
    this.search = '';
  }
  getDeviceSize() {
    this.width = screen.width;
    console.log(this.width);
    this.showCart = this.width >= 720;
  }
  toggleCart() {
    this.showCart = !this.showCart;
  }
  addCustomer() {
    this.bannerService.updateState({
      backto: `/dashboard/qoute-customer`,
    });
    this.router.navigate(['/dashboard/add-partner/customers']);
  }
}
