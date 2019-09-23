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
  private _orderProducts: BehaviorSubject<OrderProducts[]>;
  public orderProducts: Observable<OrderProducts[]>;
  url: string;
  constructor(
    private http: HttpClient
  ) {
    this._orders = new BehaviorSubject<Orders[]>(JSON.parse(localStorage.getItem('orders')) || []);
    this.orders = this._orders.asObservable();
    this._order = new BehaviorSubject<Orders>(JSON.parse(localStorage.getItem('order')));
    this.order = this._order.asObservable();
    this._orderProducts = new BehaviorSubject<OrderProducts[]>(JSON.parse(localStorage.getItem('order_products')) || []);
    this.orderProducts = this._orderProducts.asObservable();
    this.url = environment.API_URL;
  }

  public get currentOrdersValue(): Orders[] {
    return this._orders.value;
  }
  apendState(orders: Orders) {
    const state = this.currentOrdersValue || [];
    const item = state.find(x => x.OrdersId === orders.OrdersId);
    if (item) {
      alert(state.indexOf(item));
      state[state.indexOf(item)] = item;
      return;
    }
    state.push(orders);
    this._orders.next(state);
    localStorage.setItem('orders', JSON.stringify(state));
  }
  updateOrderState(order: Orders) {
    this._order.next(order);
    localStorage.setItem('order', JSON.stringify(order));
  }
  updateOrderProductsState(products: OrderProducts[]) {
    this._orderProducts.next(products);
    localStorage.setItem('order_products', JSON.stringify(products));
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

  uptadeOrder(data: Orders) {
    return this.http.post<any>(`${this.url}/api/orders/update-order.php`, data).subscribe(resp => {
      const order: Orders = resp;
      if (!order) { return false; }
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
        ProductName: item.name,
        UnitPrice: item.price,
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
      this.getProductsForAnOrder(orderId);
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
  getProductsForAnOrder(orderId: string) {
    return this.http.get<any>(`${this.url}/api/order_products/get-order_products.php?OrderId=${orderId}`).subscribe(resp => {
      const products: OrderProducts[] = resp;
      this.updateOrderProductsState(products);
    }, error => {
      alert(JSON.stringify(error));
    });
  }


}
