import { Component, OnInit } from '@angular/core';
import { AccountService, MessageService, ProductService } from 'src/app/_services';
import { Router } from '@angular/router';
import { User } from 'src/app/_models';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  user: User;
  constructor(
    private messageService: MessageService,
    private productService: ProductService,
    private accountService: AccountService,
    private router: Router,
  ) { }

  ngOnInit() {

    this.user = this.accountService.currentUserValue;
    if (!this.user) {
      this.router.navigate(['sign-in']);
      return;
    }
    if (!this.user.CompanyId) {
      // debugger
      this.createCompanyPopuP();
    }
    this.preloadData();
  }
  preloadData() {
    if (this.user.CompanyId) {
      this.productService.getProducts(this.user.CompanyId);
    }
  }
  clearMessages() {
    this.messageService.clear();
  }
  createCompanyPopuP() {
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
