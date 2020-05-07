import { Component, OnInit, Input } from '@angular/core';
import { Product, Company } from 'src/app/_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.scss']
})
export class ProductSliderComponent implements OnInit {
  @Input() products: Product[];
  @Input() company: Company;
  product: Product;
  constructor(private router: Router) { }

  ngOnInit() {
    if (this.products) {
      this.products = this.products.filter(x => x.Images && x.Images.length > 0);
      console.log(this.products);
      this.product = this.products[0];
    }

  }
  slide(index: number) {
    this.product = this.products[index];
  }
  viewItem(product: Product) {
    this.router.navigate(['shop/view-product', product.ProductId]);

  }
}
