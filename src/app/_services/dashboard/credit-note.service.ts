import { Injectable } from '@angular/core';
import { CreditNote } from 'src/app/_models/creditnote.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SpinnerService } from '.';
import { SplashService } from '../splash.service';
import { environment } from 'src/environments/environment';
import { COMMON_CONN_ERR_MSG } from 'src/app/_shared';
import { Orders } from 'src/app/_models';

@Injectable({
  providedIn: 'root'
})
export class CreditNoteService {

  url: string;

  private dataStore: {
    CreditNotes: CreditNote[]
  } = { CreditNotes: [] };


  constructor(
    private http: HttpClient
  ) {

    this.url = environment.API_URL;

  }

  addCreditNote(data: CreditNote): Observable<Orders[]> {
    return this.http.post<any>(`${this.url}/api/creditnote/add-creditnote.php`, data);
  }
}
