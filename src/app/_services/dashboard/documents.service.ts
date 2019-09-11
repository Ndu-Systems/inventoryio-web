import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  url: any;


  constructor(private http: HttpClient) { 
    this.url = environment.API_URL;

  }


  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    return this.http.post<any>(`${this.url}/api/upload/upload.php`,
      formData
    );
  }


}
