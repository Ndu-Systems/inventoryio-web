import { Injectable } from '@angular/core';
import { Email } from 'src/app/_models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SEND_EMAIL_INTERNAL } from 'src/app/_shared';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) {}

  sendEmail(data: Email): Observable<any> {
    return this.http.post<any>(SEND_EMAIL_INTERNAL, data);
  }

}
