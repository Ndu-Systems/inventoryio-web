import { Injectable } from '@angular/core';
import { Store } from 'src/app/_models';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { STORE } from 'src/app/_shared';

@Injectable({
  providedIn: 'root'
})
export class StoresService {
  private _stores = new BehaviorSubject<Store[]>([]);
  private url = environment.API_URL;
  private dataStore: {
    stores: Store[]
  } = { stores: [] };
  readonly stores = this._stores.asObservable();

  private _store: BehaviorSubject<Store>;
  public store: Observable<Store>;
  constructor(private http: HttpClient) {
    this._store = new BehaviorSubject<Store>(JSON.parse(localStorage.getItem(STORE)));
    this.store = this._store.asObservable();
  }

  updateCurrentStore(store: Store) {
    this._store.next(store);
    localStorage.setItem(STORE, JSON.stringify(store));
  }
  removeCurrentStore() {
    localStorage.removeItem(STORE);
  }

  getAllStores(companyId: string, statusId: string) {
    this.http.get<Store[]>(`${this.url}/api/stores/get-stores.php?CompanyId=${companyId}&&StatusId=${statusId}`)
      .subscribe(data => {
        this.dataStore.stores = data;
        this._stores.next(Object.assign({}, this.dataStore).stores);
      }, error => console.log('Could not load stores'));
  }

  getById(companyId: string, storeId: string) {
    this.http.get<Store>(`${this.url}/api/stores/get-stores-id.php?StoreId=${storeId}&&CompanyId=${companyId}`)
      .subscribe(data => {
        let notFound = true;
        this.dataStore.stores.forEach((item, index) => {
          if (item.StoreId === data.StoreId) {
            this.dataStore.stores[index] = data;
            notFound = false;
          }
        });
        if (notFound) {
          this.dataStore.stores.push(data);
        }
      }, error => console.log('could not load store'));
  }

  addStore(store: Store) {
    this.http.post<Store>(`${this.url}/api/stores/add-stores.php`, JSON.stringify(store))
      .subscribe(data => {
        this.dataStore.stores.push(data);
        this._stores.next(Object.assign({}, this.dataStore).stores);
      }, error => console.log('Could add a store'));
  }

  updateStore(store: Store) {
    this.http.put<Store>(`${this.url}/api/stores/update-stores.php`, JSON.stringify(store))
      .subscribe(data => {
        this.dataStore.stores.forEach((item, index) => {
          if (item.StoreId === data.StoreId) {
            this.dataStore.stores[index] = data;
          }
        });
        this.dataStore.stores.sort((x, y) => {
          return new Date(y.CreateDate).getTime() - new Date(x.CreateDate).getTime();
        });
        this._stores.next(Object.assign({}, this.dataStore).stores);
      }, error => console.log('Could not update store'));
  }

  getStoresForUser(userId: string) {
    this.http.get<Store[]>(`${this.url}/api/stores/get-stores-userid.php?UserId=${userId}`)
      .subscribe(data => {
        this.dataStore.stores = data;
        this._stores.next(Object.assign({}, this.dataStore).stores);
      }, error => console.log('Could not load stores for user'));
  }
}
