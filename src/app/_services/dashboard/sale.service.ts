import { Injectable } from '@angular/core';
import { SellModel } from 'src/app/_models/sale.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private currentSellModelsSubject: BehaviorSubject<SellModel>;
  public currentsSellModel: Observable<SellModel>;
  constructor(
  ) {
    this.currentSellModelsSubject = new BehaviorSubject<SellModel>(JSON.parse(localStorage.getItem('SellModelValue')));
    this.currentsSellModel = this.currentSellModelsSubject.asObservable();
  }

  public get currentSellModelValue(): SellModel {
    return this.currentSellModelsSubject.value;
  }
  updateState(data: SellModel) {
    this.currentSellModelsSubject.next(data);
    localStorage.setItem('SellModelValue', JSON.stringify(data));
  }

}
