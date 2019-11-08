import { Injectable } from '@angular/core';
import { SellModel, Item } from 'src/app/_models/sale.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductService } from './product.service';
@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private _sell: BehaviorSubject<SellModel>;
  public sell: Observable<SellModel>;
  constructor(
    private productService: ProductService
  ) {
    this._sell = new BehaviorSubject<SellModel>(JSON.parse(localStorage.getItem('sell')));
    this.sell = this._sell.asObservable();
  }

  public get currentSellModelValue(): SellModel {
    return this._sell.value;
  }
  updateState(data: SellModel) {
    if (data) {
      this.calculateTotal();
      this._sell.next(data);
      localStorage.setItem('sell', JSON.stringify(data));
    }

  }

  clearState() {
    this.updateState({
      items: [],
      total: 0
    });
  }

  doSellLogic(item: Item) {
    let sale;
    if (this.currentSellModelValue) {
      sale = this.currentSellModelValue;
    } else {
      this.updateState({
        items: [],
        total: 0
      });
      sale = this.currentSellModelValue;
    }

    const checkIfOtemExist = sale.items.find(x => x.prodcuId === item.prodcuId);
    const product = this.productService.getSigleProductFronState(item.prodcuId);


    if (!checkIfOtemExist) {
      item.subTotal = item.price;
      sale.items.push(item);
    } else {
      // item is on the sale already it just needs to be updated
      checkIfOtemExist.subTotal = checkIfOtemExist.quantity * item.price;
     // item.quantity++;
      this.productService.appendState(product);
    }
    product.QuantityAvailable = product.Quantity - item.quantity;
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
    }
  }

}
