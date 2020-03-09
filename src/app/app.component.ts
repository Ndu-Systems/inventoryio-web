import { Component, OnInit } from '@angular/core';
import { PwaService } from './_services';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/internal/operators/filter';
import { map } from 'rxjs/internal/operators/map';


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
    private titleService: Title,
    private activatedRoute: ActivatedRoute,


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
    this.titleService.setTitle('Inventory io | inventorr | stock management system | online mall | shooping online');

    const appTitle = this.titleService.getTitle();
    this.router
      .events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child.firstChild) {
            child = child.firstChild;
          }
          if (child.snapshot.data['title']) {
            return child.snapshot.data['title'];
          }
          return appTitle;
        })
      ).subscribe((ttl: string) => {
        this.titleService.setTitle(ttl);
      });
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
