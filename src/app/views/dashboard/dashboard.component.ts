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
  showMessage: boolean;
  messages: string[];
  class: string;
  img: string;
  link: string;
  linkname: string;
  heading: string[];

  user: User;
  constructor(
    private messageService: MessageService,
    private productService: ProductService,
    private accountService: AccountService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.messageService.currentMessage.subscribe(data => {
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
    this.preloadData();
    this.checkIfUserHaveAcompany();
  }
  preloadData() {
    if (this.user.CompanyId) {
      this.productService.getProducts(this.user.CompanyId);
    }
  }
  clearMessages() {
    this.messageService.clear();
  }
  checkIfUserHaveAcompany() {
    if (!this.user.CompanyId) {
      this.messageService.setMessage({
        heading: [`Hey John`, `Welcome to inventory-io!`],
        body: [`Your simplified  inventory
                  management with real-time
                  updates, please complete your profile to get started.`],
        canShow: true,
        class: 'success',
        img: 'assets/images/undraw_Hello_qnas.png',
        link: '/dashboard/add-company',
        linkname: 'Complete my profile',
      });
    }
  }
}
