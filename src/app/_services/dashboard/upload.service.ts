import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Image } from 'src/app/_models';
import { environment } from 'src/environments/environment';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {



  private _images: BehaviorSubject<Image[]>;
  public images: Observable<Image[]>;
  url: string;
  constructor(
    private http: HttpClient,
    private spinnerService: SpinnerService
  ) {
    this._images = new BehaviorSubject<Image[]>(JSON.parse(localStorage.getItem('images')) || []);
    this.images = this._images.asObservable();
    this.url = environment.API_URL;
  }

  public get currentImageValue(): Image[] {
    return this._images.value;
  }
  apendState(data: any) {
    let state = this.currentImageValue;
    if (!state) {
      state = [];
    }
    state.push(data);
    this.updateState(state);
  }
  updateState(data: Image[]) {
    this._images.next(data);
    localStorage.setItem('images', JSON.stringify(data));
  }
  clearState() {
    this.updateState(null);
  }
  addImage(data: Image) {
    this.spinnerService.show();
    return this.http.post<any>(`${this.url}/api/image/add-image.php`, data).subscribe(resp => {
      const image: Image = resp;
      this.apendState(image);
      this.spinnerService.hide();

    }, error => {
      this.spinnerService.hide();
      alert(JSON.stringify(error));
    });
  }
  update(data: Image) {
    return this.http.post<any>(`${this.url}/api/image/update-image.php`, data).subscribe(resp => {
      const state = this.currentImageValue.filter(x => x.ImageId !== data.ImageId);
      this.updateState(state);
    }, error => {
      alert(JSON.stringify(error));
    });
  }

  getImages(otherId) {
    return this.http.get<any>(`${this.url}/api/image/get-image.php?OtherId=${otherId}`).subscribe(resp => {
      const images: Image[] = resp;
      this.updateState(images);
    }, error => {
      alert(JSON.stringify(error));
    });
  }


}
