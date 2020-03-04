import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SpinnerService } from './spinner.service';
import { SplashService } from '../splash.service';
import { COMMON_CONN_ERR_MSG } from 'src/app/_shared';
import { Attribute } from 'src/app/_models/Attribute.model';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  private _attributes: BehaviorSubject<Attribute[]>;
  public attributes: Observable<Attribute[]>;
  url: string;

  private dataStore: {
    attributes: Attribute[]
  } = { attributes: [] };
  constructor(
    private http: HttpClient,
    private spinnerService: SpinnerService,
    private splashService: SplashService,
  ) {
    this._attributes = new BehaviorSubject<Attribute[]>(JSON.parse(localStorage.getItem('attributes')) || []);
    this.attributes = this._attributes.asObservable();
    this.url = environment.API_URL;
  }

  public get currentAttributeValue(): Attribute[] {
    return this._attributes.value;
  }
  apendState(data: Attribute) {
    const state = this.currentAttributeValue || [];
    state.push(data);
    this._attributes.next(state);
    localStorage.setItem('attributes', JSON.stringify(state));

  }

  updateState(data: Attribute[]) {
    this._attributes.next(data);
    localStorage.setItem('attributes', JSON.stringify(data));
  }



  addAttribute(data: Attribute) {
    this.spinnerService.show();
    return this.http.post<any>(`${this.url}/api/attribute/add-attribute.php`, data).subscribe(resp => {
      this.spinnerService.hide();

      const attribute: Attribute = resp;
      this.apendState(attribute);
    }, error => {
      this.spinnerService.hide();
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });

    });
  }
  updateAttribute(attribute: Attribute) {
    this.http.put<Attribute>(`${this.url}/api/Attribute/edit-Attribute.php`, JSON.stringify(attribute))
      .subscribe(data => {
        this.dataStore.attributes.forEach((item, index) => {
          if (item.AttributeId === data.AttributeId) {
            this.dataStore.attributes[index] = data;
          }
        });
        this.dataStore.attributes.sort((x, y) => {
          return new Date(y.CreateDate).getTime() - new Date(x.CreateDate).getTime();
        });
        this._attributes.next(Object.assign({}, this.dataStore).attributes);
      }, error => console.log('Could not update Attribute'));
  }

  getattributes(productId) {
    return this.http.get<any>(`${this.url}/api/attribute/get-attribute.php?ProductId=${productId}`).subscribe(resp => {
      const attributes: Attribute[] = resp;
      this.updateState(attributes);
      this.dataStore.attributes = resp;
      this._attributes.next(Object.assign({}, this.dataStore).attributes);
    }, error => {
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });

    });
  }


}
