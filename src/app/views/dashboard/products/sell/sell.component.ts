import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, SellModel } from 'src/app/_models';
import { ProductService, AccountService, BannerService, SaleService } from 'src/app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})
export class SellComponent implements OnInit {

  search: string;
  products$: Observable<Product[]>;
  sale: SellModel;
  constructor(
    private productService: ProductService,
    private router: Router,
    private accountService: AccountService,
    private bannerService: BannerService,
    private saleService: SaleService

  ) { }

  ngOnInit() {
    const user = this.accountService.currentUserValue;
    if (!user.CompanyId) { this.router.navigate(['sign-in']); }
    this.products$ = this.productService.products;
    this.productService.getProducts(user.CompanyId);

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
}
