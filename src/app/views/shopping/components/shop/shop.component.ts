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
  products$: Observable<Product[]>;
  cart$: Observable<Product[]>;
  companyId;
  cart: Product[] = [];
  company: Company;
  sale: SellModel;
  placeholder = 'assets/images/placeholder.png';
  bannerImage = 'assets/placeholders/shopheader.jpg';
  cartItems = 0;
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
      this.productService.getProducts(this.companyId);
      this.products$ = this.productService.products;

      this.companyService.getCompany(this.companyId).subscribe(r => {
        this.company = r;
        this.welocme = `Shop with ${this.company.Name}`;
        this.titleService.setTitle(`${this.welocme} | inventoryio shopping`);
        if (this.company.Banner) {
          this.bannerImage = this.company.Banner[0].Url;
        }

      });
    });
  }

  ngOnInit() {
    this.shoppingService.sell.subscribe(data => {
      if (data) {
        this.sale = data;
        this.cartItems = this.sale.items.length;
      }
    })
  }


  viewCart() {
    // this.shoppingService.setState(this.cart);
    this.router.navigate(['shopping/shopping-cart', this.companyId]);
  }
  viewItem(product: Product) {
    this.productService.updateSellProductState(product);
    this.router.navigate(['shopping/view-product', product.ProductId]);

  }

}
