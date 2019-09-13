import { Component, OnInit } from '@angular/core';
import { ProductService, AccountService, BannerService } from 'src/app/_services';
import { Product } from 'src/app/_models';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {

  search: string;
  products$: Observable<Product[]>;

  constructor(
    private productService: ProductService,
    private router: Router,
    private accountService: AccountService,
    private bannerService: BannerService

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
  }
  add() {
    this.router.navigate(['/dashboard/add-product']);
  }
  details(product: Product) {
    this.productService.updateCurrentProduct(product);
    this.router.navigate([`/dashboard/product-details`]);
  }
}
