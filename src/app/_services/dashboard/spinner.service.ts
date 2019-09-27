import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private _spinner: BehaviorSubject<boolean>;
  public spinner: Observable<boolean>;
  constructor(
  ) {
    this._spinner = new BehaviorSubject<boolean>(false);
    this.spinner = this._spinner.asObservable();
  }


  show() {
    this._spinner.next(true);
  }
  hide() {
    this._spinner.next(false);
  }

}
