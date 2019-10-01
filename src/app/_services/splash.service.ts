import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Splash } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class SplashService {


  private _splash: BehaviorSubject<Splash>;
  public splash: Observable<Splash>;
  constructor(
  ) {
    this._splash = new BehaviorSubject<Splash>({ show: false, class: `error` }
    );
    this.splash = this._splash.asObservable();
  }


  update(splash: Splash) {
    this._splash.next(splash);
  }

  hide() {
    this._splash.next({ show: false, class: `error` });
  }


}
