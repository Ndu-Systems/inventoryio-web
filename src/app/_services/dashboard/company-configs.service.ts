import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Config } from 'src/app/_models/Config';

@Injectable({
  providedIn: 'root'
})
export class CompanyConfigsService {
  private _feilds: BehaviorSubject<Config[]>;
  public feilds: Observable<Config[]>;
  constructor() {
    this._feilds = new BehaviorSubject<Config[]>(JSON.parse(localStorage.getItem('feilds')) || []);

    this.feilds = this._feilds.asObservable();
  }
  public get currentConfigValue(): Config[] {
    return this._feilds.value;
  }
  updateState(data: Config[]) {
    this._feilds.next(data);
    localStorage.setItem('feilds', JSON.stringify(data));
  }

}
