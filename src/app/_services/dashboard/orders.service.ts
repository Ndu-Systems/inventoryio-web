import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Orders, Item, OrderProducts } from 'src/app/_models';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private _orders: BehaviorSubject<Orders[]>;
  public orders: Observable<Orders[]>;
  private _order: BehaviorSubject<Orders>;
  public order: Observable<Orders>;
  url: string;
  constructor(
    private http: HttpClient
  ) {
    this._orders = new BehaviorSubject<Orders[]>(JSON.parse(localStorage.getItem('orders')) || []);
    this.orders = this._orders.asObservable();
    this._order = new BehaviorSubject<Orders>(JSON.parse(localStorage.getItem('order')));
    this.order = this._order.asObservable();
    this.url = environment.API_URL;
  }

  public get currentOrdersValue(): Orders[] {
    return this._orders.value;
  }
  apendState(orders: Orders) {
    const state = this.currentOrdersValue;
    state.push(orders);
    this._orders.next(state);
    localStorage.setItem('orders', JSON.stringify(state));
  }
  updateOrderState(order: Orders) {
    this._order.next(order);
    localStorage.setItem('order', JSON.stringify(order));
  }
  addOrder(data: Orders, items: Item[]) {
    return this.http.post<any>(`${this.url}/api/orders/add-orders.php`, data).subscribe(resp => {
      const order: Orders = resp;
      if (!order) { return false; }
      this.addOrderProducts(items, order.OrdersId, order.CreateUserId);
      this.apendState(order);
      this.updateOrderState(order);
    }, error => {
      alert(JSON.stringify(error));
    });
  }

  addOrderProducts(items: Item[], orderId: string, userId) {
    const productItems: OrderProducts[] = [];
    items.forEach(item => {
      const productItem: OrderProducts = {
        OrderId: orderId,
        ProductId: item.prodcuId,
        Quantity: item.quantity,
        subTotal: item.subTotal,
        CreateUserId: userId,
        ModifyUserId: userId,
        StatusId: 1
      };
      productItems.push(productItem);
    });
    const data = { products: productItems };
    return this.http.post<any>(`${this.url}/api/order_products/add-order_product-range.php`, data).subscribe(resp => {
      alert(JSON.stringify(resp));
      // this.apendState(order);
      // this.updateOrderState(order);
    }, error => {
      alert(JSON.stringify(error));
    });
  }

  getOrders(companyId) {
    return this.http.get<any>(`${this.url}/api/orders/get-orders.php?CompanyId=${companyId}`).subscribe(resp => {
      const orders: Orders[] = resp;
      localStorage.setItem('orders', JSON.stringify(orders));
      this._orders.next(orders);
    }, error => {
      alert(JSON.stringify(error));
    });
  }


}
