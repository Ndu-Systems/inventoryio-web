import { Component, OnInit } from '@angular/core';
import { MessageService, ProductService, AccountService } from 'src/app/_services';
import { User } from 'src/app/_models';
import { Router } from '@angular/router';

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

  user: User;
  constructor(
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.messageService.currentMessage.subscribe(data => {
      debugger
      if (data) {
        this.showMessage = data.canShow;
        this.messages = data.body;
        this.class = data.class;
        this.img = data.img;
        this.link = data.link;
        this.linkname = data.linkname;
        this.heading = data.heading;
      }

    });

    this.user = this.accountService.currentUserValue;
    if (!this.user) {
      this.router.navigate(['sign-in']);
      return;
    }

  }

  clearMessages() {
    this.messageService.clear();
  }

}
