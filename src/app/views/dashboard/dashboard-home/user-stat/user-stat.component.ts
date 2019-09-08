import { Component, OnInit } from '@angular/core';
import { UserStat, User } from 'src/app/_models';
import { AccountService } from 'src/app/_services';

@Component({
  selector: 'app-user-stat',
  templateUrl: './user-stat.component.html',
  styleUrls: ['./user-stat.component.scss']
})
export class UserStatComponent implements OnInit {
  stat: UserStat[] = [];
  user: User;
  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (Number(this.user.RoleId) === 1) {
      this.stat.push({
        name: 'Users',
        value: '1',
        image: 'assets/images/stat-users.svg'
      });
      this.stat.push({
        name: 'Stores',
        value: '1',
        image: 'assets/images/stat-store.svg'
      });
      this.stat.push({
        name: 'Orders',
        value: '1',
        image: 'assets/images/state-orders.svg'
      });
      this.stat.push({
        name: 'Stock in hand',
        value: '1',
        image: 'assets/images/stat-stock-and-hand.svg'
      });
    }
  }

}
