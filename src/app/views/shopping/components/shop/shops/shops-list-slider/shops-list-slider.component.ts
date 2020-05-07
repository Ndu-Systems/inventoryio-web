import { Component, OnInit, Input } from '@angular/core';
import { Company } from 'src/app/_models';
import { Router } from '@angular/router';
import { ShoppingService } from 'src/app/_services/home/shoping';

@Component({
  selector: 'app-shops-list-slider',
  templateUrl: './shops-list-slider.component.html',
  styleUrls: ['./shops-list-slider.component.scss']
})
export class ShopsListSliderComponent implements OnInit {
  shops: Company[];
  filterShops: Company[] = [];
  constructor(private router: Router, private shoppingService: ShoppingService) { }

  ngOnInit() {
    this.shoppingService.companies.subscribe(data => {
      if (data) {
        this.filterShops = [];
        this.shops = data;
        this.shops.forEach(x => {
          x.Products = x.Products.filter(p => p.Images);
          this.filterShops.push(x);
          // if (x.Products.filter(p => p.Images)) {
          //   this.filterShops.push(x);
          // }
        });

        console.log('filterShops', this.filterShops);

      }
    });
  }
  visitShow(shop: Company) {
    this.router.navigate(['shop/at', shop.Handler || shop.CompanyId]);
  }
}
