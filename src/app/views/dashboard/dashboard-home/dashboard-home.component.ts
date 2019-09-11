import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit() {
    const user = this.accountService.currentUserValue;
    if (!user.CompanyId) { this.router.navigate(['sign-in']); }
  }

}
