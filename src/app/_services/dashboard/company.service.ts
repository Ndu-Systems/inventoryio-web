import { Injectable } from '@angular/core';
import { Company } from 'src/app/_models';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private currentCompanySubject: BehaviorSubject<Company>;
  public currentCompany: Observable<Company>;
  url: string;
  constructor(
    private http: HttpClient
  ) {
    this.currentCompanySubject = new BehaviorSubject<Company>(JSON.parse(localStorage.getItem('currentCompany')));
    this.currentCompany = this.currentCompanySubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentCompanyValue(): Company {
    return this.currentCompanySubject.value;
  }

  addCompany(data: Company) {
    return this.http.post<any>(`${this.url}/api/company/add-company.php`, data).subscribe(resp => {
      alert(JSON.stringify(resp));
      const company: Company = resp;
      localStorage.setItem('currentCompany', JSON.stringify(company));
      this.currentCompanySubject.next(company);
    }, error => {
      alert(JSON.stringify(error));
    });
  }


}
