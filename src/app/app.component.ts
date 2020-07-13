import { Component, OnInit } from '@angular/core';
import { PwaService, CompanyService, AccountService } from './_services';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { Title } from '@angular/platform-browser';
import { User } from './_models';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly VAPID_PUBLIC_KEY = 'BNPFryJjngyVYoTAmzgsF0JX7c5qJ3IL8gS-7Le0Q1wvfMUSrKV0kCXVz8pF-AR93tTjey2B0-D4Iwr4KhOcV8E';
  companyId: any;
  company: any;

  constructor(
    public pwaService: PwaService,
    private router: Router,
    private titleService: Title,
    private accountService: AccountService


  ) {
    this.titleService.setTitle(`Tybo | Take your business online: Selling and buying platform`);
  }
  ngOnInit() {
    if (environment.production) {
      if (location.protocol === 'http:') {
        window.location.href = location.href.replace('http', 'https');
      }
    }
    // scroll up
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    const user: User = this.accountService.currentUserValue;
    if (user && user.UserId && user.CompanyId && environment.production) {
      this.router.navigate(['dashboard']);
    }

  }

  setDocTitle(title: string) {
    console.log('current title:::::' + this.titleService.getTitle());
    this.titleService.setTitle(title);
  }
  installPwa(): void {
    this.pwaService.promptEvent.prompt();
  }

  // user rights

}
