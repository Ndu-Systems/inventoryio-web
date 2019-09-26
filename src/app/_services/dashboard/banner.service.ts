import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Banner } from 'src/app/_models';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private currentBannersSubject: BehaviorSubject<Banner>;
  public currentsBanner: Observable<Banner>;
  constructor(
  ) {
    this.currentBannersSubject = new BehaviorSubject<Banner>(JSON.parse(localStorage.getItem('bannerValue')));
    this.currentsBanner = this.currentBannersSubject.asObservable();
  }

  public get currentBannerValue(): Banner {
    return this.currentBannersSubject.value;
  }
  updateState(data: Banner) {
    this.currentBannersSubject.next(data);
    localStorage.setItem('bannerValue', JSON.stringify(data));
  }

  resetBannerState() {
    this.currentBannersSubject.next(null);
  }
}
