import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavModuleServiceService {
  // Observable navItem source
  private _navItemSource = new BehaviorSubject<string>(null);
  navItem$ = this._navItemSource.asObservable();

  constructor() {
    this._navItemSource = new BehaviorSubject<string>(localStorage.getItem('Key'));
    this.navItem$ = this._navItemSource.asObservable();
   }

  changeNav(key) {
    this._navItemSource.next(key);
    localStorage.setItem('Key', key);
  }

}
