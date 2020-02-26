import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, Company, Item, SellModel, Orders } from 'src/app/_models';
import { ProductService, CompanyService } from 'src/app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ShoppingService } from 'src/app/_services/home/shoping/shopping.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  welocme = `Welcome to 'ZALOE' shopping page`;
  products$: Observable<Product[]>;
  companyId;
  company: Company;
  sale$: Observable<SellModel>;
  products: Product[];
  selectedPartner: any;
  sale: any;
  order: Orders;

  constructor(
    private productService: ProductService,
    private shoppingService: ShoppingService,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private router: Router,
    private titleService: Title

  ) {


    this.activatedRoute.params.subscribe(r => {
      this.companyId = r.id;
      this.productService.getProducts(this.companyId);
      // this.products$ = this.shoppingService.cart;

      this.companyService.getCompany(this.companyId).subscribe(r => {
        this.company = r;
        this.welocme = `Welcome to '${this.company.Name}' shopping page `;
        this.titleService.setTitle(`${this.welocme} | inventoryio shopping`);

      });
    });
  }
  ngOnInit() {
    this.sale$ = this.shoppingService.sell;
    this.shoppingService.sell.subscribe(state => {
      if (state) {
        this.sale = state;
      }
    });
    this.productService.products.subscribe(r => {
      this.products = r;
    });
  }

  back() {
    // this.shoppingService.setState(this.cart);
    this.router.navigate(['shop', this.companyId]);
  }

  add(item: Item) {
    const product = this.products.find(x => x.ProductId === item.prodcuId);
    if (Number(product.Quantity) - Number(item.quantity) <= 0) {
      // this.messageService.add({
      //   severity: 'warn',
      //   summary: 'Stock Alert.',
      //   detail: `You run out of ${product.Name}`
      // });
      return false;
    }
    item.quantity++;
    this.shoppingService.doSellLogic(item);
  }
  reduce(item: Item) {
    if (item.quantity <= 0) {
      this.shoppingService.removeItem(item);
      return;
    }
    item.quantity--;
    this.shoppingService.doSellLogic(item);
  }
  removeItem(item: Item) {
    this.shoppingService.removeItem(item);
  }
  blur(item: Item) {
    if (item.quantity <= 0) {
      this.shoppingService.removeItem(item);
      return;
    }

    const product = this.products.find(x => x.ProductId === item.prodcuId);
    if (Number(product.Quantity) - Number(item.quantity) <= 0) {
      // this.messageService.add({
      //   severity: 'warn',
      //   summary: 'Stock Alert.',
      //   detail: `You run out of ${product.Name}`
      // });
      item.quantity = product.Quantity;
      return false;
    }
    this.shoppingService.doSellLogic(item);
  }


  onSubmit() {

    if (!this.sale.total) {
      // this.messageService.add({
      //   severity: 'warn',
      //   summary: 'Empty cart',
      //   detail: 'Add items in the cart to continue'
      // });
      return false;
    }
    const order: Orders = {
      CompanyId: this.companyId,
      ParntersId: this.selectedPartner && this.selectedPartner.PartnerId || null,
      OrderType: 'Sell',
      Total: this.sale.total,
      Paid: 0,
      Due: this.sale.total,
      CreateUserId: 'customer',
      ModifyUserId: 'customer',
      Status: 'new',
      StatusId: 1
    };
    console.log(order);
    console.log('items', this.sale.items);
    this.shoppingService.addOrder(order, this.sale.items).subscribe(response => {
      this.order = response;
    });
  }

}
