import { Injectable } from '@angular/core';
import { SellModel, Item } from 'src/app/_models/sale.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private _sell: BehaviorSubject<SellModel>;
  public sell: Observable<SellModel>;
  constructor(
  ) {
    this._sell = new BehaviorSubject<SellModel>(JSON.parse(localStorage.getItem('sell')));
    this.sell = this._sell.asObservable();
  }

  public get currentSellModelValue(): SellModel {
    return this._sell.value;
  }
  updateState(data: SellModel) {
    this._sell.next(data);
    localStorage.setItem('sell', JSON.stringify(data));
  }

  doSellLogic(item: Item) {
    const sale = this.currentSellModelValue;
    if (!sale) {
      this.updateState({
        items: [],
        total: 0
      });
    }
    const checkIfOtemExist = sale.items.filter(x => x.name === item.name);
    if (!checkIfOtemExist.length) {
      sale.items.push(item);
    } else {
      checkIfOtemExist[0].quantity++;
      checkIfOtemExist[0].sub = checkIfOtemExist[0].quantity * checkIfOtemExist[0].price;
    }
  }

}
