import { Injectable } from '@angular/core';
import { Config } from 'src/app/_models/Config';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SpinnerService } from '.';
import { SplashService } from '../splash.service';
import { environment } from 'src/environments/environment';
import { COMMON_CONN_ERR_MSG } from 'src/app/_shared';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {


  private _configs: BehaviorSubject<Config[]>;
  public configs: Observable<Config[]>;
  url: string;
  constructor(
    private http: HttpClient,
    private spinnerService: SpinnerService,
    private splashService: SplashService,
  ) {
    this._configs = new BehaviorSubject<Config[]>(JSON.parse(localStorage.getItem('configs')) || []);
    this.configs = this._configs.asObservable();
    this.url = environment.API_URL;
  }

  public get currentConfigValue(): Config[] {
    return this._configs.value;
  }
  apendState(data: Config) {
    const state = this.currentConfigValue || [];
    state.push(data);
    this._configs.next(state);
    localStorage.setItem('configs', JSON.stringify(state));

  }
  updateState(data: Config[]) {
    this._configs.next(data);
    localStorage.setItem('configs', JSON.stringify(data));

  }
  addConfig(data: Config) {
    this.spinnerService.show();
    return this.http.post<any>(`${this.url}/api/config/add-config.php`, data).subscribe(resp => {
      this.spinnerService.hide();

      const config: Config = resp;
      this.apendState(config);
    }, error => {
      this.spinnerService.hide();
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });

    });
  }

  addConfigsRange(data: Config[]) {
    const configs = { configs: data };
    this.spinnerService.show();
    return this.http.post<any>(`${this.url}/api/config/add-config-range.php`, configs).subscribe(resp => {
      this.spinnerService.hide();

      const config: Config = resp;
      this.apendState(config);
    }, error => {
      this.spinnerService.hide();
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });

    });
  }
  updateConfigsRange(data: Config[]) {
    const configs = { configs: data };
    this.spinnerService.show();
    return this.http.post<any>(`${this.url}/api/config/update-config-range.php`, configs).subscribe(resp => {
      this.spinnerService.hide();

      const config: Config = resp;
      this.apendState(config);
    }, error => {
      this.spinnerService.hide();
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });

    });
  }

  getConfigs(companyId) {
    return this.http.get<any>(`${this.url}/api/config/get-configs.php?CompanyId=${companyId}`).subscribe(resp => {
      const configs: Config[] = resp;
      this.updateState(configs);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });

    });
  }

}
