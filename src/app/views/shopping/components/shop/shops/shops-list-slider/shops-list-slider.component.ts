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
        this.shops = data.filter(x => x.Products && x.Products.length > 0);
        this.shops.forEach(shop => {
          if (shop.Products && shop.Products.length) {
            let mightAdd = 0;
            shop.Products.forEach(product => {
              if (product.Images && product.Images.length) {
                mightAdd++;
              }
            });
            if (mightAdd >= 3) {
              this.filterShops.push(shop);
            }
          }

        });

        console.log('filterShops', this.filterShops);

      }
    });
  }
  visitShow(shop: Company) {
    this.router.navigate(['at', shop.Handler || shop.CompanyId]);
  }
}
