import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Product, Company } from 'src/app/_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shops-home-slider',
  templateUrl: './shops-home-slider.component.html',
  styleUrls: ['./shops-home-slider.component.scss']
})
export class ShopsHomeSliderComponent implements OnInit, OnDestroy {

  @Input() shops: Company[];

  product: Product;
  products: Product[] = [];
  intervalId: NodeJS.Timer;
  constructor(private router: Router) { }
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  ngOnInit() {
    if (this.shops) {
      this.mapProducts();

      this.intervalId = setInterval(() => {
        this.slide(0);
      }, 5000);
    }
  }


  mapProducts() {
    this.shops.map(x => x.Products).forEach(x => {
      if (x && x.length) {
        x.forEach(p => {
          this.products.push(p);
        });
      }
    });
    if (this.products) {
      console.log('this.products', this.products);

      this.products = this.products.filter(x => x.Images && x.Images.length > 0);
      console.log(this.products);
      this.product = this.products[0];
    }
  }
  slide(index: number) {
    const geus = Math.floor(Math.random() * this.products.length);
    this.product = this.products[geus];
  }
  viewItem(product: Product) {
    this.router.navigate(['shop/view-product', product.ProductId]);

  }


}
