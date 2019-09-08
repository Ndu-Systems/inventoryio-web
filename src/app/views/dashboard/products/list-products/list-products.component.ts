import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/_services';
import { Product } from 'src/app/_models';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {
  heading = 'My Products';
  backto = '/dashboard';
  count = '55';
  countLabel = 'Total Products';

  products: Product[];

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.products = this.productService.allProductsValue;
  }

}
