import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Orders, OrderProducts, Item, Product, SellModel } from 'src/app/_models';
import { HttpClient } from '@angular/common/http';
import { SplashService } from '../../splash.service';
import { environment } from 'src/environments/environment';
import { COMMON_CONN_ERR_MSG } from 'src/app/_shared';
import { ProductService } from '../..';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  private _sell: BehaviorSubject<SellModel>;
  public sell: Observable<SellModel>;
  url: string;
  constructor(
    private productService: ProductService,
    private http: HttpClient,

  ) {
    this._sell = new BehaviorSubject<SellModel>(JSON.parse(localStorage.getItem('shop_sale')));
    this.sell = this._sell.asObservable();
    this.url = environment.API_URL;

  }

  public get currentSellModelValue(): SellModel {
    return this._sell.value;
  }
  updateState(data: SellModel) {
    if (data) {
      this.calculateTotal();
      this._sell.next(data);
      localStorage.setItem('shop_sale', JSON.stringify(data));
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
      const product = this.productService.getSigleProductFronState(item.prodcuId);
      product.QuantityAvailable = item.quantity;
      this.productService.appendState(product);

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

  // save the order
  addOrder(data: Orders, items: Item[]) {
    const productItems = [];
    items.forEach(item => {
      const productItem: OrderProducts = {
        OrderId: '0',
        ProductId: item.prodcuId,
        CompanyId: data.CompanyId,
        ProductName: item.name,
        UnitPrice: item.price,
        Quantity: item.quantity,
        subTotal: item.subTotal,
        CreateUserId: data.CreateUserId,
        ModifyUserId: data.CreateUserId,
        StatusId: 1
      };
      productItems.push(productItem);
    });
    return this.http.post<any>(`${this.url}/api/orders/shop.php`, { order: data, products: productItems });
  }
}