import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Caterory } from 'src/app/_models';
import { SplashService } from '../splash.service';
import { COMMON_CONN_ERR_MSG, CATEGORY, CATEGORY_ADD_TYPE } from 'src/app/_shared';
import { CateroryAddType } from 'src/app/_models/caterory.add.type.model';

@Injectable({
  providedIn: 'root'
})
export class CateroryService {

  private _categories: BehaviorSubject<Caterory[]>;
  public categories: Observable<Caterory[]>;
  url: string;

  private dataStore: {
    categories: Caterory[]
  } = { categories: [] };

  private _category: BehaviorSubject<Caterory>;
  public category: Observable<Caterory>;


  private cateroryAddTypeBehaviorSubject: BehaviorSubject<CateroryAddType>;
  public cateroryAddTypeObservable: Observable<CateroryAddType>;

  constructor(
    private http: HttpClient,
    private splashService: SplashService,
  ) {
    this._categories = new BehaviorSubject<Caterory[]>(JSON.parse(localStorage.getItem('categories')) || []);
    this.categories = this._categories.asObservable();
    this.url = environment.API_URL;
    this._category = new BehaviorSubject<Caterory>(JSON.parse(localStorage.getItem(CATEGORY)));
    this.category = this._category.asObservable();

    this.cateroryAddTypeBehaviorSubject = new BehaviorSubject<CateroryAddType>(
      JSON.parse(localStorage.getItem(CATEGORY_ADD_TYPE)) || { nextParentName: '', nextParentId: '', nextType: 'parent' }
    );
    this.cateroryAddTypeObservable = this.cateroryAddTypeBehaviorSubject.asObservable();
  }

  public get categoriesValue(): Caterory[] {
    return this._categories.value;
  }

  public get getCateroryAddType(): CateroryAddType {
    return this.cateroryAddTypeBehaviorSubject.value;
  }
  apendState(data: Caterory) {
    const state = this.categoriesValue || [];
    state.push(data);
    this._categories.next(state);
  }
  updateCateroryAddTypeState(data: CateroryAddType) {
    this.cateroryAddTypeBehaviorSubject.next(data);
    localStorage.setItem(CATEGORY_ADD_TYPE, JSON.stringify(data));
  }

  updateCurrentCategory(category: Caterory) {
    this._category.next(category);
    localStorage.setItem(CATEGORY, JSON.stringify(category));
  }

  removeCurrentCategory() {
    localStorage.removeItem(CATEGORY);
  }
  addCaterory(data: Caterory) {
    return this.http.post<any>(`${this.url}/api/catergory/add-catergory.php`, data).subscribe(resp => {
      const caterory: Caterory = resp;
      this.apendState(caterory);
      this.getCateries(data.CompanyId);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
    });
  }

  updateCategory(category: Caterory) {
    this.http.put<Caterory>(`${this.url}/api/catergory/edit-catergory.php`, JSON.stringify(category))
      .subscribe(data => {
        this.dataStore.categories.forEach((item, index) => {
          if (item.CatergoryId === data.CatergoryId) {
            this.dataStore.categories[index] = data;
          }
        });
        this.dataStore.categories.sort((x, y) => {
          return new Date(y.CreateDate).getTime() - new Date(x.CreateDate).getTime();
        });
        this._categories.next(Object.assign({}, this.dataStore).categories.filter(c => Number(c.StatusId) > 0));
        this.getCateries(data.CompanyId);
      }, error => console.log('Could not update category'));
  }

  getCateries(companyId) {
    return this.http.get<Caterory[]>(`${this.url}/api/catergory/get-catergories.php?CompanyId=${companyId}`).subscribe(resp => {
      const caterory: Caterory[] = resp;
      localStorage.setItem('categories', JSON.stringify(caterory));
      this._categories.next(caterory);
      this.dataStore.categories = resp;
      this._categories.next(Object.assign({}, this.dataStore).categories);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
    });
  }
  getCatergoryById(categoryId: string) {
    return this.http.get<Caterory[]>(`${this.url}/api/catergory/get-catergory-by-id.php?CatergoryId=${categoryId}`);
  }
}
