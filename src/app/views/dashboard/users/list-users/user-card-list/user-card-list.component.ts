import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { User, NotFoundModel } from 'src/app/_models';
import { NotFoundConstants } from '../../../shared';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/_services';

@Component({
  selector: 'app-user-card-list',
  templateUrl: './user-card-list.component.html',
  styleUrls: ['./user-card-list.component.scss']
})
export class UserCardListComponent implements OnInit {
  @Input() user: User;
  notFoundModel: NotFoundModel;
  role: string;

  constructor(
    private routeTo: Router,
    private userService: UsersService
  ) { }
  ngOnInit() {
    this.notFoundModel = {
      Image: NotFoundConstants.NOT_FOUND_ITEMS.image,
      Message: NotFoundConstants.NOT_FOUND_ITEMS.message
    };
    this.getUser(this.user.UserId);
  }

  getUserDetails(id: string) {
    this.routeTo.navigate([`/dashboard/user-details/${id}`]);
  }

  getUser(userId: string) {
    this.userService.getUserDetails(userId)
      .subscribe(response => {
        if (response && response.Role) {
          this.role = response.Role.Name;
        }
      });
  }

}
