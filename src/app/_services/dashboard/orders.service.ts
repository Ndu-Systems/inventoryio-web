import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Orders, Item, OrderProducts, TopSellingProduct } from 'src/app/_models';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SplashService } from '../splash.service';
import { COMMON_CONN_ERR_MSG } from 'src/app/_shared';

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
  private _allOrderProducts: BehaviorSubject<OrderProducts[]>;
  public allOrderProducts: Observable<OrderProducts[]>;
  url: string;
  constructor(
    private http: HttpClient,
    private splashService: SplashService,
  ) {
    this._orders = new BehaviorSubject<Orders[]>(JSON.parse(localStorage.getItem('orders')) || []);
    this.orders = this._orders.asObservable();
    this._order = new BehaviorSubject<Orders>(JSON.parse(localStorage.getItem('order')));
    this.order = this._order.asObservable();
    this._orderProducts = new BehaviorSubject<OrderProducts[]>(JSON.parse(localStorage.getItem('order_products')) || []);
    this.orderProducts = this._orderProducts.asObservable();
    this._allOrderProducts = new BehaviorSubject<OrderProducts[]>(JSON.parse(localStorage.getItem('all_order_products')) || []);
    this.allOrderProducts = this._allOrderProducts.asObservable();
    this.url = environment.API_URL;
  }

  public get currentOrdersValue(): Orders[] {
    return this._orders.value;
  }
  public get currentProductOrdersValue(): OrderProducts[] {
    return this._orderProducts.value;
  }
  public get currentAllProductOrdersValue(): OrderProducts[] {
    return this._allOrderProducts.value;
  }
  apendState(order: Orders) {
    const state = this.currentOrdersValue || [];
    const item = state.find(x => x.OrdersId === order.OrdersId);
    if (item) {
      state[state.indexOf(item)] = item;
      return;
    }
    state.push(order);
    state.sort((x, y) => {
      return new Date(y.CreateDate).getDate() - new Date(x.CreateDate).getDate();
    });
    this._orders.next(state);
    localStorage.setItem('orders', JSON.stringify(state));
  }
  updatOrdersState(orders: Orders[]) {
    if (orders) {
      this._orders.next(orders);
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }
  updateOrderState(order: Orders) {
    this.clearSelectedClass();
    if (order) {
      if (!order.CardClass) {
        order.CardClass = ['card'];
      }
      (order.CardClass).push('card-active');
    }
    this._order.next(order);
    localStorage.setItem('order', JSON.stringify(order));
  }
  clearSelectedClass() {
    const state = this.currentOrdersValue || [];
    state.forEach(data => {
      data.CardClass = ['card'];
    });
    this._orders.next(state);
  }
  updateOrderProductsState(products: OrderProducts[]) {
    this._orderProducts.next(products);
    localStorage.setItem('order_products', JSON.stringify(products));
  }
  updateAllOrderProductsState(products: OrderProducts[]) {
    this._allOrderProducts.next(products);
    localStorage.setItem('all_order_products', JSON.stringify(products));
  }

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
        StatusId: 1,
        Options: item.options
      };
      productItems.push(productItem);
    });
    return this.http.post<any>(`${this.url}/api/orders/add-orders.php`, { order: data, products: productItems }).subscribe(resp => {
      const orders: Orders[] = resp;
      if (orders.length) {
        this.updatOrdersState(orders);
      }
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
    });
  }
  addOrderFromQoute(data: Orders) {
    return this.http.post<any>(`${this.url}/api/orders/add-orders.php`, { order: data, products: data.Products });
  }


  addPurchaseOrder(data: Orders, items: OrderProducts[]): Observable<any> {
    return this.http.post<any>(`${this.url}/api/orders/add-orders.php`, { order: data, products: items });
  }


  uptadeOrder(data: Orders) {
    return this.http.post<any>(`${this.url}/api/orders/update-order.php`, data).subscribe(resp => {
      const order: Orders = resp;
      if (!order) { return false; }
      this.apendState(order);
      this.updateOrderState(order);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
    });
  }

  addOrderProducts(items: Item[], orderId: string, userId, companyId) {
    const productItems: OrderProducts[] = [];
    items.forEach(item => {
      const productItem: OrderProducts = {
        OrderId: orderId,
        ProductId: item.prodcuId,
        CompanyId: companyId,
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
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
    });
  }

  loadCurrentOrder(orders: Orders[], orderType: string) {
    if (orders.length > 0) {
      orders = orders.filter(x => x.OrderType === orderType);
      this._orders.next(orders);


      if (this._order.value && this._order.value.OrderType === orderType) {
        const order = orders.find(x => x.OrdersId === this._order.value.OrdersId);
        order.CardClass.push('card-active');
        order.Show = true;
        this.updateOrderState(order);
      } else {
        if (orders[0]) {
          orders[0].CardClass.push('card-active');
          orders[0].Show = true;
          this.updateOrderState(orders[0]);
        } else {
          this._order.next(null);
          localStorage.removeItem('order');
        }
      }


    }
  }
  getOrders(companyId) {
    return this.http.get<any>(`${this.url}/api/orders/get-orders.php?CompanyId=${companyId}`).subscribe(resp => {
      const orders: Orders[] = resp;
      this._orders.next(orders);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
    });
  }
  getOrdersByEmail(ParntersEmail) {
    return this.http.get<any>(`${this.url}/api/orders/get-orders-for-customer.php?ParntersEmail=${ParntersEmail}`);
  }
  getOrdersForType(companyId): Observable<Orders[]> {
    return this.http.get<Orders[]>(`${this.url}/api/orders/get-orders.php?CompanyId=${companyId}`);
  }
  getOrderProductsByCompanyId(companyId) {
    return this.http.get<any>(
      `${this.url}/api/order_products/get-order_products-by-companyId.php?CompanyId=${companyId}`
    ).subscribe(resp => {
      const all: OrderProducts[] = resp;
      if (all.length) {
        this.updateAllOrderProductsState(all);
      }
    }, error => {
      console.log(error);
    });
  }

  getProductsForAnOrder(orderId: string) {
    return this.http.get<any>(`${this.url}/api/order_products/get-order_products.php?OrderId=${orderId}`).subscribe(resp => {
      const products: OrderProducts[] = resp;
      this.updateOrderProductsState(products);
    }, error => {
      console.log(error);

    });
  }


  //email
  getOrderById(orderId): Observable<any> {
    return this.http.get<any>(`${this.url}/api/orders/get-order-by-id.php?OrderId=${orderId}`);
  }

}
