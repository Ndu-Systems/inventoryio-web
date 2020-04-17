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
      total: 0,
      companyId: ''
    });
  }

  // doSellLogic(item: Item) {
  //   let sale;
  //   if (this.currentSellModelValue) {
  //     sale = this.currentSellModelValue;
  //   } else {
  //     this.updateState({
  //       items: [],
  //       total: 0
  //     });
  //     sale = this.currentSellModelValue;
  //   }

  //   const checkIfOtemExist = sale.items.find(x => x.prodcuId === item.prodcuId);
  //   const product = this.productService.getSigleProductFronState(item.prodcuId);


  //   if (!checkIfOtemExist) {
  //     item.subTotal = item.price * item.quantity;
  //     sale.items.push(item);
  //   } else {
  //     // item is on the sale already it just needs to be updated
  //     checkIfOtemExist.subTotal = checkIfOtemExist.quantity * item.price;
  //    // item.quantity++;
  //     this.productService.appendState(product);
  //   }
  //   product.QuantityAvailable = product.Quantity - item.quantity;
  //   this.updateState(sale);

  // }


  doSellLogic(item: Item) {
    let sale;
    if (this.currentSellModelValue) {
      sale = this.currentSellModelValue;
    } else {
      this.updateState({
        items: [],
        total: 0,
        companyId: ''
      });
      sale = this.currentSellModelValue;
    }
    const checkIfOtemExist = sale.items.find(x => x.prodcuId === item.prodcuId &&
      (JSON.stringify(item.options) === JSON.stringify(x.options)));
    const product = this.productService.getSigleProductFronState(item.prodcuId);


    if (checkIfOtemExist) {
      // item is on the sale already it just needs to be updated
      checkIfOtemExist.subTotal = checkIfOtemExist.quantity * item.price;
      sale.items[sale.items.indexOf(item)] = checkIfOtemExist;
      this.updateState(sale);
      this.productService.appendState(product);

    } else {
      item.subTotal = item.price * item.quantity;
      sale.items.push(item);
      this.updateState(sale);

    }
    product.QuantityAvailable = product.Quantity - item.quantity;

  }
  removeItem(item: Item) {
    if (this.currentSellModelValue) {
      const sale = this.currentSellModelValue;
      const product = this.productService.getSigleProductFronState(item.prodcuId);
      product.QuantityAvailable = item.quantity;
      this.productService.appendState(product);

      const itemToRemove = sale.items.indexOf(item);
      sale.items.splice(itemToRemove, 1);
      this.updateState(sale);
    }
  }
  calculateTotal() {
    // if (this.currentSellModelValue) {
    //   let total = 0;
    //   const sale = this.currentSellModelValue;
    //   sale.items.forEach(item => {
    //     total += item.subTotal;
    //   });
    //   sale.total = total;
    // }

    if (this.currentSellModelValue) {
      let total = 0;
      const sale = this.currentSellModelValue;
      sale.items.forEach(item => {
        total += item.subTotal;
      });
      if (sale.charges) {
        sale.charges.forEach(x => {
          if (!isNaN(x && x.amount)) {
            total += Number(x.amount);
          }

        });
      }
      sale.total = total;
    }
  }



}
