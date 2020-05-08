import { Component, OnInit, Input } from '@angular/core';
import { ShoppingService } from 'src/app/_services/home/shoping/shopping.service';
import { Observable } from 'rxjs';
import { SellModel, Company } from 'src/app/_models';
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
  @Input() logoUrl;
  @Input() company;
  sale: SellModel;
  cartItems = 0;
  showCart: boolean;
  companyUrl = '';
  constructor(private shoppingService: ShoppingService, private router: Router) { }

  ngOnInit() {
    if (this.company) {
      this.companyUrl = `/shop/at/${this.company.Handler || this.company.CompanyId}`;
    }
    this.shoppingService.sell.subscribe(state => {
      if (state) {
        this.sale = state;
        this.cartItems = 0;
        this.sale.items.forEach(x => {
          this.cartItems += Number(x.quantity);
        });
      }
    });

    this.shoppingService.company.subscribe(data => {
      if (data) {
        this.company = data;
        if (this.company.Logo) {
          this.logoUrl = this.company.Logo[0].Url;
          // this.shopSecondaryColor = this.company.Theme.find(x => x.Name === 'shopSecondaryColor').Value;
        }
      }
    });
  }
  toggleNav() {
    this.showMobileNav = !this.showMobileNav;
  }
  viewCart() {
    this.showCart = false;
    this.router.navigate(['shop/shopping-cart', this.sale.companyId]);
  }
}
