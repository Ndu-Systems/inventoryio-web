import { Injectable } from '@angular/core';
import { Store } from 'src/app/_models';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

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
  constructor(private http: HttpClient) { }

  getAllStores(companyId: string) {
    this.http.get<Store[]>(`${this.url}/api/stores/get-stores.php?CompanyId=${companyId}`)
      .subscribe(data => {
        this.dataStore.stores = data;
        this._stores.next(Object.assign({}, this.dataStore).stores);
      }, error => console.log('Could not load stores'));
  }

  getById(companyId, storeId) {
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
        this._stores.next(Object.assign({}, this.dataStore).stores);
      }, error => console.log('Could not update store'));
  }
}
