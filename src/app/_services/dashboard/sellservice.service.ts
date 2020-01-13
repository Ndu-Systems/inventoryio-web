import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ServiceOrder } from 'src/app/_models/serviceorder.model';
import { ServiceOrderProducts } from 'src/app/_models/serviceorder.product.model';
import { HttpClient } from '@angular/common/http';
import { SplashService } from '../splash.service';
import { environment } from 'src/environments/environment';
import { Item } from 'src/app/_models';
import { COMMON_CONN_ERR_MSG } from 'src/app/_shared';

@Injectable({
  providedIn: 'root'
})
export class SellserviceService {

 private _ServiceOrders: BehaviorSubject<ServiceOrder[]>;
  public ServiceOrders: Observable<ServiceOrder[]>;
  private _qoute: BehaviorSubject<ServiceOrder>;
  public qoute: Observable<ServiceOrder>;
  private _ServiceOrderProducts: BehaviorSubject<ServiceOrderProducts[]>;
  public ServiceOrderProducts: Observable<ServiceOrderProducts[]>;
  url: string;
  constructor(
    private http: HttpClient,
    private splashService: SplashService,
  ) {
    this._ServiceOrders = new BehaviorSubject<ServiceOrder[]>(JSON.parse(localStorage.getItem('quotation')) || []);
    this.ServiceOrders = this._ServiceOrders.asObservable();
    this._qoute = new BehaviorSubject<ServiceOrder>(JSON.parse(localStorage.getItem('quote')));
    this.qoute = this._qoute.asObservable();
    this._ServiceOrderProducts = new BehaviorSubject<ServiceOrderProducts[]>(JSON.parse(localStorage.getItem('quotation_products')) || []);
    this.ServiceOrderProducts = this._ServiceOrderProducts.asObservable();
    this.url = environment.API_URL;
  }

  public get currentServiceOrderValue(): ServiceOrder[] {
    return this._ServiceOrders.value;
  }
  apendState(Qoute: ServiceOrder) {
    const state = this.currentServiceOrderValue || [];
    const item = state.find(x => x.ServiceOrderId === Qoute.ServiceOrderId);
    if (item) {
      state[state.indexOf(item)] = item;
      return;
    }
    state.push(Qoute);
    state.sort((x, y) => {
      return new Date(y.CreateDate).getTime() - new Date(x.CreateDate).getTime();
    });
    this._ServiceOrders.next(state);
    localStorage.setItem('quotation', JSON.stringify(state));
  }
  updateServiceOrderState(qoute: ServiceOrder) {
    this.clearSelectedClass();
    if (qoute) {
      qoute.CardClass.push('card-active');
    }
    this._qoute.next(qoute);
    localStorage.setItem('quote', JSON.stringify(qoute));
  }
  clearSelectedClass() {
    const state = this.currentServiceOrderValue || [];
    state.forEach(data => {
      data.CardClass = ['card'];
    });
    this._ServiceOrders.next(state);
  }
  updateServiceOrderProductsState(products: ServiceOrderProducts[]) {
    this._ServiceOrderProducts.next(products);
    localStorage.setItem('quotation_products', JSON.stringify(products));
  }

  addQoute(data: ServiceOrder, items: Item[]) {
    return this.http.post<any>(`${this.url}/api/quotation/add-quotation.php`, data).subscribe(resp => {
      const Qoute: ServiceOrder = resp;
      if (!Qoute) { return false; }
      this.addServiceOrderProducts(items, Qoute.ServiceOrderId, Qoute.CreateUserId);
      this.apendState(Qoute);
      this.updateServiceOrderState(Qoute);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
    });
  }

  uptadeQoute(data: ServiceOrder) {
    return this.http.post<any>(`${this.url}/api/quotation/update-quotation.php`, data).subscribe(resp => {
      const Qoute: ServiceOrder = resp;
      if (!Qoute) { return false; }
      this.apendState(Qoute);
      this.updateServiceOrderState(Qoute);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
    });
  }

  addServiceOrderProducts(items: Item[], QouteId: string, userId) {
    const productItems: ServiceOrderProducts[] = [];
    items.forEach(item => {
      const productItem: ServiceOrderProducts = {
        ServiceOrderId: QouteId,
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
    return this.http.post<any>(`${this.url}/api/quotation_products/add-quotation_products-range.php`, data).subscribe(resp => {
      this.getProductsForAnQoute(QouteId);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
    });
  }

  getServiceOrders(companyId) {
    return this.http.get<any>(`${this.url}/api/quotation/get-quotations.php?CompanyId=${companyId}`).subscribe(resp => {
      const ServiceOrder: ServiceOrder[] = resp;
      localStorage.setItem('quotation', JSON.stringify(ServiceOrder));
      this.updateServiceOrderState(ServiceOrder[0]);

      // make the first Qoute selected by defoult.
      if (ServiceOrder.length) {
       
        ServiceOrder[0].CardClass.push('card-active');
      }
      this._ServiceOrders.next(ServiceOrder);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
    });
  }

  getProductsForAnQoute(QouteId: string) {
    return this.http.get<any>(`${this.url}/api/quotation_products/get-quotation_products.php?QouteId=${QouteId}`).subscribe(resp => {
      const products: ServiceOrderProducts[] = resp;
      this.updateServiceOrderProductsState(products);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
    });
  }


  // email
  getQouteById(QouteId): Observable<any> {
    return this.http.get<any>(`${this.url}/api/quotation/get-quotation-by-id.php?QouteId=${QouteId}`);
  }


}
