import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  url: any;
  fileOfBlob: File;
  formData: FormData;


  constructor(private http: HttpClient) {
    this.url = environment.API_URL;

  }

  // moveFile(file: File): Observable<any> {
  //   return this.http.post<any>(`${this.url}/api/upload/upload.php`,
  //   this.formData
  // );
  // }
  uploadFile(formData): Observable<any> {
    // this.cropImage(file);
    // alert(file.type);
    // alert(file.name);
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('name', file.name);
    // return this.http.post<any>(`${this.url}/api/upload/upload.php`,
    //   formData
    // );
  
    // if (this.fileOfBlob) {
    return this.http.post<any>(`${this.url}/api/upload/upload.php`,
      formData
    );
    // }
  }
}
