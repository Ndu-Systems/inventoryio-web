import { Component, OnInit } from '@angular/core';
import { MessageService, ProductService, AccountService } from 'src/app/_services';
import { User, Message, Splash } from 'src/app/_models';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SpinnerService } from 'src/app/_services/dashboard/spinner.service';
import { SplashService } from 'src/app/_services/splash.service';

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
  spinner$: Observable<boolean>;
  splash$: Observable<Splash>;

  user: User;
  constructor(
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router,
    private spinnerService: SpinnerService,
    private splashService: SplashService,
  ) { }

  ngOnInit() {
    this.message$ = this.messageService.messages;
    this.spinner$ = this.spinnerService.spinner;
    this.splash$ = this.splashService.splash;
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
