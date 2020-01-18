import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Scann } from 'src/app/_models/scanner.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  private _scann: BehaviorSubject<Scann>;
  public scann: Observable<Scann>;

  url: string;
  constructor(

  ) {
    this._scann = new BehaviorSubject<Scann>(null);
    this.scann = this._scann.asObservable();
    this.url = environment.API_URL;
  }

  updateCannState(scann: Scann) {
    this._scann.next(scann);
    localStorage.setItem('product', JSON.stringify(scann));
  }

  closeScanner() {
    this.updateCannState({ isOpen: false });
  }

}
