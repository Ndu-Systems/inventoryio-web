import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { User, NotFoundModel } from 'src/app/_models';
import { NotFoundConstants } from '../../../shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-card-list',
  templateUrl: './user-card-list.component.html',
  styleUrls: ['./user-card-list.component.scss']
})
export class UserCardListComponent implements OnInit {
  @Input() user: User;
  notFoundModel: NotFoundModel;
  constructor(
    private routeTo: Router
  ) { }
  ngOnInit() {
    this.notFoundModel = {
      Image: NotFoundConstants.NOT_FOUND_ITEMS.image,
      Message: NotFoundConstants.NOT_FOUND_ITEMS.message
    };
  }

  getUserDetails(user: User) {
    this.routeTo.navigate([`/dashboard/user-details/${user.UserId}`]);
  }

}
