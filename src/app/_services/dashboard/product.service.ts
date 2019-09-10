import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from 'src/app/_models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private currentProductsSubject: BehaviorSubject<Product[]>;
  public currentProducts: Observable<Product[]>;

  // current product working with
  private currentProductSubject: BehaviorSubject<Product>;
  public currentProduct: Observable<Product>;

  url: string;
  constructor(
    private http: HttpClient
  ) {
    this.currentProductsSubject = new BehaviorSubject<Product[]>(JSON.parse(localStorage.getItem('allProducts')));
    this.currentProducts = this.currentProductsSubject.asObservable();

    // Selected product
    this.currentProductSubject = new BehaviorSubject<Product>(null);
    this.currentProduct = this.currentProductSubject.asObservable();

    this.url = environment.API_URL;
  }

  public get allProductsValue(): Product[] {
    if (this.currentProductsSubject.value) {
      return this.currentProductsSubject.value;
    }
    this.currentProductsSubject.next(JSON.parse(localStorage.getItem('allProducts')));
    return this.currentProductsSubject.value;
  }
  // state
  appendState(product: Product) {
    let state = this.allProductsValue;
    const existingProduct = state.filter(x => x.ProductId === product.ProductId);
    if (existingProduct.length > 0) {
      state = state.filter(x => x.ProductId !== product.ProductId);
      state.push(product);
    } else {
      state.push(product);
    }
    this.currentProductsSubject.next(state);
  }
  // state
  updateCurrentProduct(product: Product) {
    this.currentProductSubject.next(product);
  }

  addProduct(data: Product) {
    return this.http.post<any>(`${this.url}/api/product/add-product.php`, data).subscribe(resp => {
      const product: Product = resp;
      if (product.ProductId) {
        this.appendState(product);
        this.updateCurrentProduct(product);
      }
    }, error => {
      alert(JSON.stringify(error));
    });
  }

  getProducts(companyId) {
    return this.http.get<any>(`${this.url}/api/product/get-products.php?CompanyId=${companyId}`).subscribe(resp => {
      const products: Product[] = resp;
      localStorage.setItem('allProducts', JSON.stringify(products));
      this.currentProductsSubject.next(products);
    }, error => {
      alert(JSON.stringify(error));
    });
  }

}
