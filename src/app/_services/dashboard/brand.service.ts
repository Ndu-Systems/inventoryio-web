import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Brand } from 'src/app/_models';

@Injectable({
  providedIn: 'root'
})
export class BrandService {


  private currentBrandsSubject: BehaviorSubject<Brand[]>;
  public currentsBrand: Observable<Brand[]>;
  url: string;
  constructor(
    private http: HttpClient
  ) {
    this.currentBrandsSubject = new BehaviorSubject<Brand[]>(JSON.parse(localStorage.getItem('currentBrands')) || []);
    this.currentsBrand = this.currentBrandsSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentBrandValue(): Brand[] {
    return this.currentBrandsSubject.value;
  }
apendState(data: Brand) {
const state = this.currentBrandValue;
state.push(data);
this.currentBrandsSubject.next(state);
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
      const Brands: Brand[] = resp;
      localStorage.setItem('currentBrands', JSON.stringify(Brands));
      this.currentBrandsSubject.next(Brands);
    }, error => {
      alert(JSON.stringify(error));
    });
  }


}
