import { Injectable } from '@angular/core';
import { Company } from 'src/app/_models';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SplashService } from '../splash.service';
import { COMMON_CONN_ERR_MSG } from 'src/app/_shared';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private currentCompanySubject: BehaviorSubject<Company>;
  public currentCompany: Observable<Company>;
  url: string;
  constructor(
    private http: HttpClient,
    private splashService: SplashService
  ) {
    this.currentCompanySubject = new BehaviorSubject<Company>(JSON.parse(localStorage.getItem('currentCompany')));
    this.currentCompany = this.currentCompanySubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentCompanyValue(): Company {
    return this.currentCompanySubject.value;
  }
  updateState(company: Company) {
    localStorage.setItem('currentCompany', JSON.stringify(company));
    this.currentCompanySubject.next(company);
  }
  addCompany(data: Company) {
    return this.http.post<any>(`${this.url}/api/company/add-company.php`, data).subscribe(resp => {
      const company: Company = resp;
      localStorage.setItem('currentCompany', JSON.stringify(company));
      this.currentCompanySubject.next(company);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
    });
  }

  addCompanySync(data: Company): Observable<Company> {
    return this.http.post<Company>(`${this.url}/api/company/add-company.php`, data);
  }


}
