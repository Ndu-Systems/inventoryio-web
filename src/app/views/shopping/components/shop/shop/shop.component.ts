import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, Company, SellModel } from 'src/app/_models';
import { ProductService, CompanyService } from 'src/app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ShoppingService } from 'src/app/_services/home/shoping/shopping.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  // welocme = `Welcome to 'ZALOE' shopping page`;
  welocme = ``;
  products: Product[];
  cart$: Observable<Product[]>;
  companyId;
  cart: Product[] = [];
  company: Company;
  sale: SellModel;
  placeholder;
  bannerImage;
  cartItems = 0;
  shopPrimaryColor: string;
  shopSecondaryColor: string;
  constructor(
    private productService: ProductService,
    private shoppingService: ShoppingService,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private titleService: Title,
    private router: Router

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.companyId = r.id;
      this.initScreen(this.companyId);
    });
  }

  ngOnInit() {
    this.shoppingService.sell.subscribe(data => {
      if (data) {
        this.sale = data;
        this.cartItems = 0;
        this.sale.items.forEach(x => {
          this.cartItems += Number(x.quantity);
        });
      }
    });
  }

  initScreen(companyId) {
    this.productService.getProductsInitShopObservable(companyId).subscribe(data => {
      if (data) {
        this.products = data.products;
        this.company = data.company;
        this.dataReady();
      }
    });
  }

  dataReady() {
    if (this.company.Banner) {
      this.bannerImage = this.company.Banner[0].Url;
    }
    if (this.company.Theme) {
      if (this.shopPrimaryColor !== this.company.Theme.find(x => x.Name === 'shopPrimaryColor').Value &&
        this.shopSecondaryColor !== this.company.Theme.find(x => x.Name === 'shopSecondaryColor').Value) {
        this.shopPrimaryColor = this.company.Theme.find(x => x.Name === 'shopPrimaryColor').Value;
        this.shopSecondaryColor = this.company.Theme.find(x => x.Name === 'shopSecondaryColor').Value;
      }
    }
  }

  viewCart() {
    this.router.navigate(['shop/shopping-cart', this.companyId]);
  }
  viewItem(product: Product) {
    this.productService.updateSellProductState(product);
    this.router.navigate(['shop/view-product', product.ProductId]);

  }

}
