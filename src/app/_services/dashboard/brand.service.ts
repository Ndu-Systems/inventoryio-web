import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Brand } from 'src/app/_models';
import { SpinnerService } from './spinner.service';
import { SplashService } from '../splash.service';
import { COMMON_CONN_ERR_MSG, BRAND } from 'src/app/_shared';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private _brands: BehaviorSubject<Brand[]>;
  public brands: Observable<Brand[]>;
  url: string;

  private dataStore: {
    brands: Brand[]
  } = { brands: [] };

  private _brand: BehaviorSubject<Brand>;
  public brand: Observable<Brand>;
  constructor(
    private http: HttpClient,
    private spinnerService: SpinnerService,
    private splashService: SplashService,
  ) {
    this._brands = new BehaviorSubject<Brand[]>(JSON.parse(localStorage.getItem('brands')) || []);
    this.brands = this._brands.asObservable();
    this.url = environment.API_URL;
    this._brand = new BehaviorSubject<Brand>(JSON.parse(localStorage.getItem(BRAND)));
    this.brand = this._brand.asObservable();
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

  updateCurrentBrand(brand: Brand) {
    this._brand.next(brand);
    localStorage.setItem(BRAND, JSON.stringify(brand));
  }

  removeCurrentBrand() {
    localStorage.removeItem(BRAND);
  }

  addBrand(data: Brand) {
    this.spinnerService.show();
    return this.http.post<any>(`${this.url}/api/brand/add-brand.php`, data).subscribe(resp => {
      this.spinnerService.hide();

      const brand: Brand = resp;
      this.apendState(brand);
    }, error => {
      this.spinnerService.hide();
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });

    });
  }
  updateBrand(brand: Brand) {
    this.http.put<Brand>(`${this.url}/api/brand/edit-brand.php`, JSON.stringify(brand))
      .subscribe(data => {
        this.dataStore.brands.forEach((item, index) => {
          if (item.BrandId === data.BrandId) {
            this.dataStore.brands[index] = data;
          }
        });
        this.dataStore.brands.sort((x, y) => {
          return new Date(y.CreateDate).getTime() - new Date(x.CreateDate).getTime();
        });
        this._brands.next(Object.assign({}, this.dataStore).brands);
      }, error => console.log('Could not update brand'));
  }

  getBrands(companyId) {
    return this.http.get<any>(`${this.url}/api/brand/get-brands.php?CompanyId=${companyId}`).subscribe(resp => {
      const brands: Brand[] = resp;
      this.updateState(brands);
      this.dataStore.brands = resp;
      this._brands.next(Object.assign({}, this.dataStore).brands);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });

    });
  }


}
