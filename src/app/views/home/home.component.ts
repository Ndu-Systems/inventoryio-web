import { Component, OnInit } from '@angular/core';
import { SplashService } from 'src/app/_services/splash.service';
import { Observable } from 'rxjs';
import { Splash } from 'src/app/_models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  showMobileNav;
  splash$: Observable<Splash>;


  constructor(private splashService: SplashService,
    ) { }

  ngOnInit() {
    this.splash$ = this.splashService.splash;
  }
  toggleNav() {
    this.showMobileNav = !this.showMobileNav;
  }
}

