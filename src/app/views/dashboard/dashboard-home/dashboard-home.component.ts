import { Component, OnInit } from '@angular/core';
import { AccountService, MessageService, ProductService, BannerService } from 'src/app/_services';
import { Router } from '@angular/router';
import { User } from 'src/app/_models';
import { DEFAULT_PASSWORD } from '../shared';
import { Title } from '@angular/platform-browser';

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
    private bannerService: BannerService,
    private router: Router,
    private titleService: Title,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.accountService.checkSession();
    this.titleService.setTitle(`${this.user.Company.Name} Dashboard : Inventory IO`);
    if (this.user.Password === DEFAULT_PASSWORD && this.user.CompanyId) {
      this.router.navigate(['dashboard/reset-password']);
      this.bannerService.updateState({
        heading: 'Reset Password',
        backto: '/sign-in'
      });
    }
    if (!this.user.CompanyId) {
      this.router.navigate(['/dashboard/add-company']);
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
  // createCompanyPopuP() {
  //   this.messageService.setMessage({
  //     heading: [`Hey John`, `Welcome to inventory-io!`],
  //     body: [`Your simplified  inventory
  //               management with real-time
  //               updates, please complete your profile to get started.`],
  //     canShow: true,
  //     class: 'success',
  //     img: 'assets/images/undraw_Hello_qnas.png',
  //     link: '/dashboard/add-company',
  //     linkname: 'Complete my profile',
  //   });

  // }

}
