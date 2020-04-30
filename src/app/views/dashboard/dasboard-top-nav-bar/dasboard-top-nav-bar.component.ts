import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dasboard-top-nav-bar',
  templateUrl: './dasboard-top-nav-bar.component.html',
  styleUrls: ['./dasboard-top-nav-bar.component.scss']
})
export class DasboardTopNavBarComponent implements OnInit {
  user$: Observable<User> = this.accountService.user;

  constructor(private accountService: AccountService,    private routeTo: Router
    ) { }

  ngOnInit() {
  }
  toProfile() {
    this.routeTo.navigate(['dashboard/profile']);

  }
}
