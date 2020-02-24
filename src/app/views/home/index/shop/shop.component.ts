import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, Company } from 'src/app/_models';
import { ProductService, CompanyService } from 'src/app/_services';
import { ActivatedRoute } from '@angular/router';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  welocme = `Welcome to 'ZALOE' shopping page`;
  products$: Observable<Product[]>;
  companyId;
  cart: Product[] = [];
  company: Company;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private titleService: Title

  ) {


    this.activatedRoute.params.subscribe(r => {
      this.companyId = r.id;
      this.productService.getProducts(this.companyId);
      this.products$ = this.productService.products;

      this.companyService.getCompany(this.companyId).subscribe(r => {
        this.company = r;
        this.welocme = `Welcome to '${this.company.Name}' shopping page `;
        this.titleService.setTitle(`${this.welocme} | inventoryio shopping`);

      });
    });
  }

  ngOnInit() {
  }
  addToCart(product: Product) {
    if (!this.cart.find(x => x.ProductId === product.ProductId)) {
      this.cart.push(product);
    }
  }

}
