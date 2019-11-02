import { Component, OnInit } from '@angular/core';
import { SplashService } from 'src/app/_services/splash.service';
import { Observable } from 'rxjs';
import { Splash } from 'src/app/_models';

@Component({
  selector: 'app-splash-home',
  templateUrl: './splash-home.component.html',
  styleUrls: ['./splash-home.component.scss']
})
export class SplashHomeComponent implements OnInit {
  splash$: Observable<Splash>;
  constructor(private splashService: SplashService) { }

  ngOnInit() {
    this.splash$ = this.splashService.splash;
  }
  close() {
    this.splashService.hide();
  }
}
