import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Partner } from 'src/app/_models';
import { SpinnerService } from './spinner.service';
import { SplashService } from '../splash.service';
import { COMMON_CONN_ERR_MSG } from 'src/app/_shared';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  private _partners: BehaviorSubject<Partner[]>;
  public partners: Observable<Partner[]>;
  url: string;
  constructor(
    private http: HttpClient,
    private spinnerService: SpinnerService,
    private splashService: SplashService,
  ) {
    this._partners = new BehaviorSubject<Partner[]>(JSON.parse(localStorage.getItem('partners')) || []);
    this.partners = this._partners.asObservable();
    this.url = environment.API_URL;
  }

  public get currentPartnerValue(): Partner[] {
    return this._partners.value;
  }
  apendState(data: Partner) {
    const state = this.currentPartnerValue || [];
    state.push(data);
    this._partners.next(state);
    localStorage.setItem('partners', JSON.stringify(state));

  }
  updateState(data: Partner[]) {
    this._partners.next(data);
    localStorage.setItem('partners', JSON.stringify(data));

  }
  addPartner(data: Partner) {
    this.spinnerService.show();
    return this.http.post<any>(`${this.url}/api/partner/add-partner.php`, data).subscribe(resp => {
      this.spinnerService.hide();

      const partner: Partner = resp;
      this.apendState(partner);
    }, error => {
      this.spinnerService.hide();
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });

    });
  }

  getPartners(companyId) {
    return this.http.get<any>(`${this.url}/api/partner/get-partner.php?CompanyId=${companyId}`).subscribe(resp => {
      const partners: Partner[] = resp;
      this.updateState(partners);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });

    });
  }
}
