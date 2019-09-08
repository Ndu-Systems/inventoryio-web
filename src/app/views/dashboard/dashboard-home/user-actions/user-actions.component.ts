import { Component, OnInit } from '@angular/core';
import { UserActions, User } from 'src/app/_models';
import { AccountService } from 'src/app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-actions',
  templateUrl: './user-actions.component.html',
  styleUrls: ['./user-actions.component.scss']
})
export class UserActionsComponent implements OnInit {
  actions: UserActions[] = [];
  user: User;
  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (Number(this.user.RoleId) === 1) {
      this.actions.push({
        name: 'Sell',
        image: 'assets/images/actions/sell.svg',
        link: ''
      },
        {
          name: 'Purchase order',
          image: 'assets/images/actions/puchaseorder.svg',
          link: ''
        },
        {
          name: 'Add Products',
          image: 'assets/images/actions/addproduct.svg',
          link: 'dashboard/add-product'
        },
        {
          name: 'List Products',
          image: 'assets/images/actions/listproducts.svg',
          link: 'dashboard/list-product'
        },
        {
          name: 'Attributes',
          image: 'assets/images/actions/attributes.svg',
          link: ''
        },
        {
          name: 'Reports',
          image: 'assets/images/actions/reports.svg',
          link: 'dashboard/add-company'
        }
      );
    }
  }
  openAction(link) {
    if (link) {
      this.router.navigate([link]);
    }
  }

}
