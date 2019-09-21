import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Image } from 'src/app/_models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {


  private currentImagesSubject: BehaviorSubject<Image[]>;
  public currentsImage: Observable<Image[]>;
  url: string;
  constructor(
    private http: HttpClient
  ) {
    this.currentImagesSubject = new BehaviorSubject<Image[]>(JSON.parse(localStorage.getItem('currentImages')) || []);
    this.currentsImage = this.currentImagesSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentImageValue(): Image[] {
    return this.currentImagesSubject.value;
  }
  apendState(data: Image) {
    let state = this.currentImageValue;
    if (!state) {
      state = [];
    }
    state.push(data);
    this.currentImagesSubject.next(state);
  }
  clearState() {
    this.currentImagesSubject.next(null);
  }
  addImage(data: Image) {
    return this.http.post<any>(`${this.url}/api/image/add-image.php`, data).subscribe(resp => {
      const image: Image = resp;
      this.apendState(image);
    }, error => {
      alert(JSON.stringify(error));
    });
  }

  getImages(otherId) {
    return this.http.get<any>(`${this.url}/api/image/get-image.php?OtherId=${otherId}`).subscribe(resp => {
      const Images: Image[] = resp;
      localStorage.setItem('currentImages', JSON.stringify(Images));
      this.currentImagesSubject.next(Images);
    }, error => {
      alert(JSON.stringify(error));
    });
  }


}
