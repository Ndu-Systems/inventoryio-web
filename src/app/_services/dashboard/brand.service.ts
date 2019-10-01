import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Brand } from 'src/app/_models';
import { SpinnerService } from './spinner.service';
import { SplashService } from '../splash.service';

@Injectable({
  providedIn: 'root'
})
export class BrandService {


  private _brands: BehaviorSubject<Brand[]>;
  public brands: Observable<Brand[]>;
  url: string;
  constructor(
    private http: HttpClient,
    private spinnerService: SpinnerService,
    private splashService: SplashService,
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
    this.spinnerService.show();
    return this.http.post<any>(`${this.url}/api/brand/add-brand.php`, data).subscribe(resp => {
      this.spinnerService.hide();

      const brand: Brand = resp;
      this.apendState(brand);
    }, error => {
      // alert(JSON.stringify(error));
      this.spinnerService.hide();
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: `sorry it looks like you're on a slow connection.`,
        class: `error`
      });

    });
  }

  getBrands(companyId) {
    return this.http.get<any>(`${this.url}/api/brand/get-brands.php?CompanyId=${companyId}`).subscribe(resp => {
      const brands: Brand[] = resp;
      this.updateState(brands);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: `Sorry it looks like you're on a slow connection.`,
        class: `error`
      });

    });
  }


}
