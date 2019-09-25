import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Brand } from 'src/app/_models';

@Injectable({
  providedIn: 'root'
})
export class BrandService {


  private _brands: BehaviorSubject<Brand[]>;
  public brands: Observable<Brand[]>;
  url: string;
  constructor(
    private http: HttpClient
  ) {
    this._brands = new BehaviorSubject<Brand[]>(JSON.parse(localStorage.getItem('brands')) || []);
    this.brands = this._brands.asObservable();
    this.url = environment.API_URL;
  }

  public get currentBrandValue(): Brand[] {
    return this._brands.value;
  }
  apendState(data: Brand) {
    const state = this.currentBrandValue || [];
    state.push(data);
    this._brands.next(state);
    localStorage.setItem('brands', JSON.stringify(state));

  }
  updateState(data: Brand[]) {
    this._brands.next(data);
    localStorage.setItem('brands', JSON.stringify(data));

  }
  addBrand(data: Brand) {
    return this.http.post<any>(`${this.url}/api/brand/add-brand.php`, data).subscribe(resp => {
      const brand: Brand = resp;
      this.apendState(brand);
    }, error => {
      alert(JSON.stringify(error));
    });
  }

  getBrands(companyId) {
    return this.http.get<any>(`${this.url}/api/brand/get-brands.php?CompanyId=${companyId}`).subscribe(resp => {
      const brands: Brand[] = resp;
      this.updateState(brands);
    }, error => {
      alert(JSON.stringify(error));
    });
  }


}
