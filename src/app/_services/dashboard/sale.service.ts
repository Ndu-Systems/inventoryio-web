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
    const checkIfOtemExist = sale.items.find(x => x.prodcuId === item.prodcuId);
    if (!checkIfOtemExist) {
      item.subTotal = item.price;
      sale.items.push(item);
      // checkIfOtemExist[0].subTotal =  item.price;
    } else {
      checkIfOtemExist.subTotal = checkIfOtemExist.quantity * item.price;
    }
  }
  removeItem(item: Item) {
    if (this.currentSellModelValue) {
      const sale = this.currentSellModelValue;
      const itemToRemove = sale.items.indexOf(item);
      sale.items.splice(itemToRemove, 1);
      this._sell.next(sale);
    }
  }

}
