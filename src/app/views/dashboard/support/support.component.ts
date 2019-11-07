import { Component, OnInit } from '@angular/core';
import { AccountService, SupportService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { Support, User } from 'src/app/_models';
import { StatusConstant } from '../shared';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  tickets$: Observable<Support[]>;
  constructor(
    private accountService: AccountService,
    private supportService: SupportService
  ) { }

  ngOnInit() {
    const user: User = this.accountService.currentUserValue;
    this.tickets$ = this.supportService.supportTickets;
    this.supportService.getAllCompanyTickets(user.CompanyId, StatusConstant.ACTIVE_STATUS);
  }

}
