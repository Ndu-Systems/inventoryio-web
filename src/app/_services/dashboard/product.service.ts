import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from 'src/app/_models';
import { environment } from 'src/environments/environment';
import { SpinnerService } from '.';

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
    private spinnerService: SpinnerService

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
    let state = this._products.value;
    const existingProduct = state.filter(x => x.ProductId === product.ProductId);
    if (existingProduct.length > 0) {
      state = state.filter(x => x.ProductId !== product.ProductId);
      state.push(product);
    } else {
      state.push(product);
    }
    this._products.next(state);
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
      alert(JSON.stringify(error));
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
      alert(JSON.stringify(error));
      this.spinnerService.hide();
    });
  }

  getProducts(companyId) {
    return this.http.get<any>(`${this.url}/api/product/get-detailed-products.php?CompanyId=${companyId}`).subscribe(resp => {
      const products: Product[] = resp;
      localStorage.setItem('products', JSON.stringify(products));
      this._products.next(products);
    }, error => {
      alert(JSON.stringify(error));
    });
  }
}
