import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models';
import { AccountService } from 'src/app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile-dp',
  templateUrl: './user-profile-dp.component.html',
  styleUrls: ['./user-profile-dp.component.scss']
})
export class UserProfileDpComponent implements OnInit {
  user$: Observable<User> = this.accountService.user;
  @Output() closeNav = new EventEmitter<boolean>();
  constructor(
    private accountService: AccountService,
    private routeTo: Router
  ) { }

  ngOnInit() {
  }

  toProfile() {
    this.routeTo.navigate(['dashboard/profile']);

  }

}
