import { Component, OnInit } from '@angular/core';
import { ProductService, AccountService } from 'src/app/_services';
import { Product } from 'src/app/_models';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {
  heading = 'My Products';
  backto = '/dashboard';
  countLabel = 'Total Products';
  search: string;
  img = 'http://localhost:8200/inventoryiodb-api/images/car.jpg';
  products$: Observable<Product[]>;

  constructor(
    private productService: ProductService,
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    const user = this.accountService.currentUserValue;
    if (!user.CompanyId) { this.router.navigate(['sign-in']); }
    this.products$ = this.productService.products;
    this.productService.getProducts(user.CompanyId);
  }
  add() {
    this.router.navigate(['/dashboard/add-product']);
  }
  details(product: Product) {
    this.productService.updateCurrentProduct(product);
    this.router.navigate([`/dashboard/product-details`]);
  }
}
