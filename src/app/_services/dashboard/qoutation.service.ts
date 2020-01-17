import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Qoutation, Item, QouteProducts } from 'src/app/_models';
import { HttpClient } from '@angular/common/http';
import { SplashService } from '../splash.service';
import { environment } from 'src/environments/environment';
import { COMMON_CONN_ERR_MSG } from 'src/app/_shared';

@Injectable({
  providedIn: 'root'
})
export class QoutationService {

  private _qoutations: BehaviorSubject<Qoutation[]>;
  public qoutations: Observable<Qoutation[]>;
  private _qoute: BehaviorSubject<Qoutation>;
  public qoute: Observable<Qoutation>;
  private _qouteProducts: BehaviorSubject<QouteProducts[]>;
  public qouteProducts: Observable<QouteProducts[]>;
  url: string;
  constructor(
    private http: HttpClient,
    private splashService: SplashService,
  ) {
    this._qoutations = new BehaviorSubject<Qoutation[]>(JSON.parse(localStorage.getItem('quotations')) || []);
    this.qoutations = this._qoutations.asObservable();
    this._qoute = new BehaviorSubject<Qoutation>(JSON.parse(localStorage.getItem('quote')));
    this.qoute = this._qoute.asObservable();
    this._qouteProducts = new BehaviorSubject<QouteProducts[]>(JSON.parse(localStorage.getItem('quotation_products')) || []);
    this.qouteProducts = this._qouteProducts.asObservable();
    this.url = environment.API_URL;
  }

  public get currentQoutationValue(): Qoutation[] {
    return this._qoutations.value;
  }
  apendState(Qoute: Qoutation) {
    const state = this.currentQoutationValue || [];
    const item = state.find(x => x.QuotationId === Qoute.QuotationId);
    if (item) {
      state[state.indexOf(item)] = item;
      return;
    }
    state.push(Qoute);
    state.sort((x, y) => {
      return new Date(y.CreateDate).getTime() - new Date(x.CreateDate).getTime();
    });
    this._qoutations.next(state);
    localStorage.setItem('quotations', JSON.stringify(state));
  }
  updateQoutationState(qoute: Qoutation) {
    this.clearSelectedClass();
    if (qoute) {
      qoute.CardClass.push('card-active');
    }
    this._qoute.next(qoute);
    localStorage.setItem('quote', JSON.stringify(qoute));
  }
  clearSelectedClass() {
    const state = this.currentQoutationValue || [];
    state.forEach(data => {
      data.CardClass = ['card'];
    });
    this._qoutations.next(state);
  }
  updateQouteProductsState(products: QouteProducts[]) {
    this._qouteProducts.next(products);
    localStorage.setItem('quotation_products', JSON.stringify(products));
  }

  addQoute(data: Qoutation, items: Item[]) {
    return this.http.post<any>(`${this.url}/api/quotation/add-quotation.php`, data).subscribe(resp => {
      const Qoute: Qoutation = resp;
      if (!Qoute) { return false; }
      this.addQouteProducts(items, Qoute.QuotationId, Qoute.CreateUserId);
      this.apendState(Qoute);
      this.updateQoutationState(Qoute);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
    });
  }

  uptadeQoute(data: Qoutation) {
    return this.http.post<any>(`${this.url}/api/quotation/update-quotation.php`, data).subscribe(resp => {
      const Qoute: Qoutation = resp;
      if (!Qoute) { return false; }
      this.apendState(Qoute);
      this.updateQoutationState(Qoute);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
    });
  }

  addQouteProducts(items: Item[], QouteId: string, userId) {
    const productItems: QouteProducts[] = [];
    items.forEach(item => {
      const productItem: QouteProducts = {
        QuotationId: QouteId,
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

  getQoutations(companyId) {
    return this.http.get<any>(`${this.url}/api/quotation/get-quotations.php?CompanyId=${companyId}`).subscribe(resp => {
      const qoutation: Qoutation[] = resp;
      localStorage.setItem('quotation', JSON.stringify(qoutation));
      this.updateQoutationState(qoutation[0]);

      // make the first Qoute selected by defoult.
      if (qoutation.length) {
       
        qoutation[0].CardClass.push('card-active');
      }
      this._qoutations.next(qoutation);
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
      const products: QouteProducts[] = resp;
      this.updateQouteProductsState(products);
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
