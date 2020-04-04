import { Component, OnInit } from '@angular/core';
import { ShoppingService } from 'src/app/_services/home/shoping/shopping.service';
import { Company } from 'src/app/_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss']
})
export class ShopsComponent implements OnInit {
  shops: Company[] = [];
  constructor(private shoppingService: ShoppingService, private router: Router,

  ) { }

  ngOnInit() {
    this.shoppingService.getAllShops().subscribe(data => {
      this.shops = data;
    });
  }
  visitShow(shop: Company) {
    this.router.navigate(['shop/at', shop.Handler || shop.CompanyId]);
  }
  scroll() {
    window.scrollBy(0, 1100);
  }
}
