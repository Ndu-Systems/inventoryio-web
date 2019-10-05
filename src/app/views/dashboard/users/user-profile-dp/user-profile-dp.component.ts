import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models';
import { AccountService } from 'src/app/_services';

@Component({
  selector: 'app-user-profile-dp',
  templateUrl: './user-profile-dp.component.html',
  styleUrls: ['./user-profile-dp.component.scss']
})
export class UserProfileDpComponent implements OnInit {
  user$: Observable<User> = this.accountService.user;

  constructor(private accountService: AccountService,
  ) { }

  ngOnInit() {
  }

}
