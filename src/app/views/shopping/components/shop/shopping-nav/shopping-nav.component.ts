import { Component, OnInit, Input } from '@angular/core';
import { ShoppingService } from 'src/app/_services/home/shoping/shopping.service';
import { Observable } from 'rxjs';
import { SellModel } from 'src/app/_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-nav',
  templateUrl: './shopping-nav.component.html',
  styleUrls: ['./shopping-nav.component.scss']
})
export class ShoppingNavComponent implements OnInit {
  showMobileNav: boolean;
  @Input() shopPrimaryColor = '#104CE5';
  @Input() shopSecondaryColor = '#ffffff';
  sale: SellModel;
  cartItems = 0;
  company: import("c:/NDU/apps/inventoryio-web/src/app/_models/company.model").Company;
  constructor(private shoppingService: ShoppingService, private router: Router) { }

  ngOnInit() {
    this.shoppingService.sell.subscribe(state => {
      if (state) {
        this.sale = state;
        this.cartItems = this.sale.items.length;
      }
    });

    this.shoppingService.company.subscribe(data => {
      if (data) {
        this.company = data;
        if (this.company.Theme) {
          // this.shopPrimaryColor = this.company.Theme.find(x => x.Name === 'shopPrimaryColor').Value;
          // this.shopSecondaryColor = this.company.Theme.find(x => x.Name === 'shopSecondaryColor').Value;
        }
      }
    });
  }
  toggleNav() {
    this.showMobileNav = !this.showMobileNav;
  }
  viewCart() {
    this.router.navigate(['shopping/shopping-cart', this.company.CompanyId]);
  }
}
