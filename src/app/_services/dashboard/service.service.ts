import { Injectable } from '@angular/core';
import { Service, Caterory } from 'src/app/_models';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SpinnerService } from '.';
import { SplashService } from '../splash.service';
import { environment } from 'src/environments/environment';
import { COMMON_CONN_ERR_MSG } from 'src/app/_shared';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private _services: BehaviorSubject<Service[]>;
  public services: Observable<Service[]>;

  // current service working with
  private _service: BehaviorSubject<Service>;
  public service: Observable<Service>;

  url: string;
  constructor(
    private http: HttpClient,
    private spinnerService: SpinnerService,
    private splashService: SplashService,

  ) {
    this._services = new BehaviorSubject<Service[]>(JSON.parse(localStorage.getItem('services')) || []);
    this.services = this._services.asObservable();

    // Selected service
    this._service = new BehaviorSubject<Service>(JSON.parse(localStorage.getItem('service')));
    this.service = this._service.asObservable();

    this.url = environment.API_URL;
  }


  // state
  appendState(service: Service) {
    let state = this._services.value || [];
    const existingservice = state.find(x => x.ServiceId === service.ServiceId);
    if (existingservice) {
      state = state.filter(x => x.ServiceId !== service.ServiceId);
      state.push(service);
    } else {
      state.push(service);
    }
    // sort
    state.sort((x, y) => {
      return new Date(y.CreateDate).getTime() - new Date(x.CreateDate).getTime();
    });
    this._services.next(state);
    localStorage.setItem('services', JSON.stringify(state));

  }

  updateState(services: Service[]) {
    // sort
    if (!services) {
      services = [];
    }
    services.sort((x, y) => {
      return new Date(y.CreateDate).getTime() - new Date(x.CreateDate).getTime();
    });
    this._services.next(services);
    localStorage.setItem('services', JSON.stringify(services));

  }
  getSigleserviceFronState(id: string) {
    return this._services.value.find(x => x.ServiceId === id);
  }
  // state
  updateCurrentService(service: Service) {
    this._service.next(service);
    localStorage.setItem('service', JSON.stringify(service));
  }

  addService(data: Service) {
    this.spinnerService.show();
    return this.http.post<any>(`${this.url}/api/service/add-service.php`, data).subscribe(resp => {
      const service: Service = resp;
      if (service.ServiceId) {
        this.appendState(service);
        this.updateCurrentService(service);
      }
      this.spinnerService.hide();
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
      this.spinnerService.hide();
    });
  }
  addServiceRange(data: Service[], cats: Caterory[] = []): Observable<any> {
    this.spinnerService.show();
    return this.http.post<any>(`${this.url}/api/service/add-service-range.php`, { services: data, catergories: cats });
  }
  updateService(data: Service) {
    this.spinnerService.show();
    return this.http.post<any>(`${this.url}/api/service/update-service.php`, data).subscribe(resp => {
      const service: Service = resp;
      if (service.ServiceId) {
        this.appendState(service);
        this.updateCurrentService(service);
      }
      this.spinnerService.hide();
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
      this.spinnerService.hide();
    });
  }
  updateServiceRange(services: Service[]) {
    this.spinnerService.show();
    return this.http.post<any>(`${this.url}/api/service/update-services-range.php`, { services }).subscribe(resp => {
      if (resp) {
        this.getServices(services[0].CompanyId);
        this.spinnerService.hide();

      }
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
      this.spinnerService.hide();

    });
  }

  getServices(companyId) {
    return this.http.get<any>(`${this.url}/api/service/get-detailed-services.php?CompanyId=${companyId}`).subscribe(resp => {
      const services: Service[] = resp;
      this.updateState(services);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
    });
  }

}
