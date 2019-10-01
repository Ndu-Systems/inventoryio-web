import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Caterory } from 'src/app/_models';
import { SplashService } from '../splash.service';

@Injectable({
  providedIn: 'root'
})
export class CateroryService {

  private _categories: BehaviorSubject<Caterory[]>;
  public categories: Observable<Caterory[]>;
  url: string;
  constructor(
    private http: HttpClient,
    private splashService: SplashService,
  ) {
    this._categories = new BehaviorSubject<Caterory[]>(JSON.parse(localStorage.getItem('categories')) || []);
    this.categories = this._categories.asObservable();
    this.url = environment.API_URL;
  }

  public get categoriesValue(): Caterory[] {
    return this._categories.value;
  }
  apendState(data: Caterory) {
    const state = this.categoriesValue || [];
    state.push(data);
    this._categories.next(state);
  }
  addCaterory(data: Caterory) {
    return this.http.post<any>(`${this.url}/api/catergory/add-catergory.php`, data).subscribe(resp => {
      const caterory: Caterory = resp;
      this.apendState(caterory);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: `Sorry it looks like you're on a slow connection.`,
        class: `error`
      });
    });
  }

  getCateries(companyId) {
    return this.http.get<any>(`${this.url}/api/catergory/get-catergories.php?CompanyId=${companyId}`).subscribe(resp => {
      const caterory: Caterory[] = resp;
      localStorage.setItem('categories', JSON.stringify(caterory));
      this._categories.next(caterory);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: `Sorry it looks like you're on a slow connection.`,
        class: `error`
      });
    });
  }


}
