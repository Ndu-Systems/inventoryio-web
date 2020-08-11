import { Component, OnInit } from '@angular/core';
import { UserActions, User } from 'src/app/_models';
import { AccountService, ProductService } from 'src/app/_services';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-user-actions',
  templateUrl: './user-actions.component.html',
  styleUrls: ['./user-actions.component.scss']
})
export class UserActionsComponent implements OnInit {
  actions: UserActions[] = [];
  user: User;
  constructor(private accountService: AccountService, private router: Router, private productService: ProductService) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (true) {
      this.actions.push({
        name: 'Sell',
        image: 'assets/images/actions/sell.svg',
        link: 'dashboard/sell'
      },
        // {
        //   name: 'Purchase order',
        //   image: 'assets/images/actions/puchaseorder.svg',
        //   link: ''
        // },
        {
          name: 'Add Products',
          image: 'assets/images/actions/addproduct.svg',
          link: 'dashboard/product'
        },
        {
          name: 'List Products',
          image: 'assets/images/actions/listproducts.svg',
          link: 'dashboard/list-product'
        },
        {
          name: 'My Online Shop',
          image: 'assets/images/actions/listproducts.svg',
          link: `at/${this.user.Company.Handler || this.user.CompanyId}`
        },
        // {
        //   name: 'Attributes',
        //   image: 'assets/images/actions/attributes.svg',
        //   link: ''
        // },
        // {
        //   name: 'Reports',
        //   image: 'assets/images/actions/reports.svg',
        //   link: 'dashboard/add-company'
        // }
      );
    }
  }
  openAction(link: string) {
    if (link && link.includes('shop')) {
      window.open(`${environment.BASE_URL}/#/${link}`, '_blank');
      return;
    }
    if (link && link.includes('product')) {
      this.productService.updateCurrentProduct(null);
      this.router.navigate([link]);
      return;
    }
    if (link) {
      this.router.navigate([link]);
    }
  }

}
