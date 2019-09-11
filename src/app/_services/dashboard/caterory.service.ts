import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Caterory } from 'src/app/_models';

@Injectable({
  providedIn: 'root'
})
export class CateroryService {

  private currentCaterorySubject: BehaviorSubject<Caterory[]>;
  public currentCaterory: Observable<Caterory[]>;
  url: string;
  constructor(
    private http: HttpClient
  ) {
    this.currentCaterorySubject = new BehaviorSubject<Caterory[]>(JSON.parse(localStorage.getItem('currentCatergories')) || []);
    this.currentCaterory = this.currentCaterorySubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentCateroryValue(): Caterory[] {
    return this.currentCaterorySubject.value;
  }
  apendState(data: Caterory) {
    const state = this.currentCateroryValue;
    state.push(data);
    this.currentCaterorySubject.next(state);
  }
  addCaterory(data: Caterory) {
    return this.http.post<any>(`${this.url}/api/catergory/add-catergory.php`, data).subscribe(resp => {
      const caterory: Caterory = resp;
      this.apendState(caterory);
    }, error => {
      alert(JSON.stringify(error));
    });
  }

  getCateries(companyId) {
    return this.http.get<any>(`${this.url}/api/catergory/get-catergories.php?CompanyId=${companyId}`).subscribe(resp => {
      const caterory: Caterory[] = resp;
      localStorage.setItem('currentCatergories', JSON.stringify(caterory));
      this.currentCaterorySubject.next(caterory);
    }, error => {
      alert(JSON.stringify(error));
    });
  }


}
