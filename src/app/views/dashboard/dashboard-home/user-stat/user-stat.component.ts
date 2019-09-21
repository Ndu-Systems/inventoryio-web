import { Component, OnInit } from '@angular/core';
import { UserStat, User } from 'src/app/_models';
import { AccountService } from 'src/app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-stat',
  templateUrl: './user-stat.component.html',
  styleUrls: ['./user-stat.component.scss']
})
export class UserStatComponent implements OnInit {
  stat: UserStat[] = [];
  user: User;
  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (true) {
      this.stat.push({
        name: 'Users',
        value: '1',
        image: 'assets/images/stat-users.svg',
        link: 'dashboard/list-users'
      });
      this.stat.push({
        name: 'Stores',
        value: '1',
        image: 'assets/images/stat-store.svg',
        link: 'dashboard/list-stores'
      });
      this.stat.push({
        name: 'Orders',
        value: '1',
        image: 'assets/images/state-orders.svg',
        link: 'dashboard/list-orders'
      });
      this.stat.push({
        name: 'Products',
        value: '1',
        image: 'assets/images/stat-stock-and-hand.svg',
        link: 'dashboard/list-products'
      });
    }
  }
  goto(link) {
    if (!link) { return false; }
    this.router.navigate([link]);
  }
}
