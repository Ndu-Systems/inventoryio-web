import { Component, OnInit } from '@angular/core';
import { MessageService, ProductService, AccountService } from 'src/app/_services';
import { User, Message } from 'src/app/_models';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  showMessage;
  messages: string[];
  class: string;
  img: string;
  link: string;
  linkname: string;
  heading: string[];
  message$: Observable<Message>;

  user: User;
  constructor(
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.message$ = this.messageService.messages;
    this.user = this.accountService.currentUserValue;
    if (!this.user) {
      this.router.navigate(['sign-in']);
      return;
    }

  }

  clearMessages(url) {
    this.messageService.clear();
    this.router.navigate([url]);

  }

}
