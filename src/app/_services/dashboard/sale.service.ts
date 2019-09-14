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
    this.calculateTotal();
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
    } else {
      checkIfOtemExist.subTotal = checkIfOtemExist.quantity * item.price;
    }
    this.updateState(sale);

  }
  removeItem(item: Item) {
    if (this.currentSellModelValue) {
      const sale = this.currentSellModelValue;
      const itemToRemove = sale.items.indexOf(item);
      sale.items.splice(itemToRemove, 1);
      this.updateState(sale);
    }
  }
  calculateTotal() {
    if (this.currentSellModelValue) {
      let total = 0;
      const sale = this.currentSellModelValue;
      sale.items.forEach(item => {
        total += item.subTotal;
      });
      sale.total = total;
      this.updateState(sale);

    }
  }

}
