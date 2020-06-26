import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/_services';
import { User, SellModel } from 'src/app/_models';
import { ShoppingService } from 'src/app/_services/home/shoping';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-shop-checkout',
  templateUrl: './shop-checkout.component.html',
  styleUrls: ['./shop-checkout.component.scss']
})
export class ShopCheckoutComponent implements OnInit {
  user: User;
  sale$: Observable<SellModel>;
  user$: Observable<User>;
  isGuest: boolean;
  companyId: string;
  productName = '';
  productDescription = '';
  merchantId = '15863973';
  merchantKey = 'xbamuwn3paoji';
  shopingSuccesfulUrl: string;
  paymentCallbackUrl: string;
  paymentCancelledUrl: string;
  constructor(
    private accountService: AccountService,
    private shoppingService: ShoppingService,
    private router: Router,
  ) {

  }
  ngOnInit(): void {
    this.user = this.accountService.currentUserValue;
    this.sale$ = this.shoppingService.sell;
    this.user$ = this.accountService.user;
    this.shoppingService.sell.subscribe(sale => {
      if (sale) {
        this.companyId = sale.companyId;
        this.shopingSuccesfulUrl = `${environment.BASE_URL}/shoping-succesful/${this.companyId}`;
        this.paymentCancelledUrl = `${environment.BASE_URL}/payment-cancelled/${this.companyId}`;
        this.paymentCallbackUrl = `${environment.BASE_URL}/payment-callback`;
        this.productName = sale.items.map(x => x.name).toString();
        this.productDescription = this.productName;
        if (this.productName.length > 100) {
          this.productName = this.productName.substring(0, 99);
        }
        if (this.productDescription.length > 255) {
          this.productDescription = this.productDescription.substring(0, 254);
        }
      }
    });
  }
  contineuAsGuest() {
    this.isGuest = true;
  }

  back() {
    this.router.navigate(['at', this.companyId]);
  }
  payments() {
    this.router.navigate(['at', this.companyId]);
  }

}
