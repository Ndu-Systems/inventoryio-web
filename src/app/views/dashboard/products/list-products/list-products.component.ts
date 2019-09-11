import { Component, OnInit } from '@angular/core';
import { ProductService, AccountService } from 'src/app/_services';
import { Product } from 'src/app/_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {
  heading = 'My Products';
  backto = '/dashboard';
  count = 0;
  countLabel = 'Total Products';
  search: string;
  //img = 'http://localhost:8200/inventoryiodb-api/images/ph.png';
  img = 'http://localhost:8200/inventoryiodb-api/images/car.jpg';
  products: Product[];

  constructor(
    private productService: ProductService,
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    const user = this.accountService.currentUserValue;
    if (!user.CompanyId) { this.router.navigate(['sign-in']); }
    this.products = this.productService.allProductsValue;
    this.count = this.products.length || 0;
    this.productService.getProducts(user.CompanyId);
  }
  add() {
    this.router.navigate(['/dashboard/add-product']);
  }
}
