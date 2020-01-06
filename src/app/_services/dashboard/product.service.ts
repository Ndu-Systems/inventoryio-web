import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from 'src/app/_models';
import { environment } from 'src/environments/environment';
import { SpinnerService } from '.';
import { SplashService } from '../splash.service';
import { COMMON_CONN_ERR_MSG } from 'src/app/_shared';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private _products: BehaviorSubject<Product[]>;
  public products: Observable<Product[]>;

  // current product working with
  private _product: BehaviorSubject<Product>;
  public product: Observable<Product>;

  url: string;
  constructor(
    private http: HttpClient,
    private spinnerService: SpinnerService,
    private splashService: SplashService,

  ) {
    this._products = new BehaviorSubject<Product[]>(JSON.parse(localStorage.getItem('products')) || []);
    this.products = this._products.asObservable();

    // Selected product
    this._product = new BehaviorSubject<Product>(JSON.parse(localStorage.getItem('product')));
    this.product = this._product.asObservable();

    this.url = environment.API_URL;
  }


  // state
  appendState(product: Product) {
    let state = this._products.value || [];
    const existingProduct = state.find(x => x.ProductId === product.ProductId);
    if (existingProduct) {
      state = state.filter(x => x.ProductId !== product.ProductId);
      state.push(product);
    } else {
      state.push(product);
    }
    // sort
    state.sort((x, y) => {
      return new Date(y.CreateDate).getTime() - new Date(x.CreateDate).getTime();
    });
    this._products.next(state);
    localStorage.setItem('products', JSON.stringify(state));

  }

  updateState(products: Product[]) {
    // sort
    if (!products) {
      products = [];
    }
    products.sort((x, y) => {
      return new Date(y.CreateDate).getTime() - new Date(x.CreateDate).getTime();
    });
    this._products.next(products);
    localStorage.setItem('products', JSON.stringify(products));

  }
  getSigleProductFronState(id: string) {
    return this._products.value.find(x => x.ProductId === id);
  }
  // state
  updateCurrentProduct(product: Product) {
    this._product.next(product);
    localStorage.setItem('product', JSON.stringify(product));
  }

  addProduct(data: Product) {
    this.spinnerService.show();
    return this.http.post<any>(`${this.url}/api/product/add-product.php`, data).subscribe(resp => {
      const product: Product = resp;
      if (product.ProductId) {
        this.appendState(product);
        this.updateCurrentProduct(product);
      }
      this.spinnerService.hide();
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
      this.spinnerService.hide();
    });
  }
  addProductRange(data: Product[]) {
    this.spinnerService.show();
    return this.http.post<any>(`${this.url}/api/product/add-product-range.php`, data).subscribe(resp => {
      const product: Product = resp;
      if (product.ProductId) {
        this.appendState(product);
        this.updateCurrentProduct(product);
      }
      this.spinnerService.hide();
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
      this.spinnerService.hide();
    });
  }
  updateProduct(data: Product) {
    this.spinnerService.show();
    return this.http.post<any>(`${this.url}/api/product/update-product.php`, data).subscribe(resp => {
      const product: Product = resp;
      if (product.ProductId) {
        this.appendState(product);
        this.updateCurrentProduct(product);
      }
      this.spinnerService.hide();
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
      this.spinnerService.hide();
    });
  }
  updateProductRange(products: Product[]) {
    this.spinnerService.show();
    return this.http.post<any>(`${this.url}/api/product/update-products-range.php`, { products }).subscribe(resp => {
      if (resp) {
        this.getProducts(products[0].CompanyId);
        this.spinnerService.hide();

      }
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
      this.spinnerService.hide();

    });
  }

  getProducts(companyId) {
    return this.http.get<any>(`${this.url}/api/product/get-detailed-products.php?CompanyId=${companyId}`).subscribe(resp => {
      const products: Product[] = resp;
      this.updateState(products);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
    });
  }
}
