import { Component, OnInit } from '@angular/core';
import { PwaService } from './_services';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SwPush, SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly VAPID_PUBLIC_KEY = 'BNPFryJjngyVYoTAmzgsF0JX7c5qJ3IL8gS-7Le0Q1wvfMUSrKV0kCXVz8pF-AR93tTjey2B0-D4Iwr4KhOcV8E';

  constructor(
    public pwaService: PwaService,
    private router: Router,
    private swPush: SwPush,
    private update: SwUpdate,


  ) {
    update.available.subscribe(update => {
      console.log('an update');

    });
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
  }
  installPwa(): void {
    this.pwaService.promptEvent.prompt();
  }

  // user rights

}
