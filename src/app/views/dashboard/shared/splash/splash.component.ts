import { Component, OnInit } from '@angular/core';
import { SplashService } from 'src/app/_services/splash.service';
import { Observable } from 'rxjs';
import { Splash } from 'src/app/_models';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {
  splash$: Observable<Splash>;
  constructor(private splashService: SplashService) { }

  ngOnInit() {
    this.splash$ = this.splashService.splash;
  }
  close() {
    this.splashService.hide();
  }
}
