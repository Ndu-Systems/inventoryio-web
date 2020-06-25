import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/_services';
import { User, SellModel } from 'src/app/_models';
import { ShoppingService } from 'src/app/_services/home/shoping';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


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
      }
    })
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
