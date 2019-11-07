import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Support } from 'src/app/_models';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private _supportTickets = new BehaviorSubject<Support[]>([]);
  private url = environment.API_URL;
  private dataStore: {
    supportTickets: Support[]
  } = { supportTickets: [] };

  readonly supportTickets = this._supportTickets.asObservable();

  constructor(private http: HttpClient) { }

  getAllCompanyTickets(companyId: string, statusId: string) {
    this.http.get<Support[]>(`${this.url}/api/support/get-company-support.php?CompanyId=${companyId}&StatusId=${statusId}`)
      .subscribe(data => {
        this.dataStore.supportTickets = data;
        this._supportTickets.next(Object.assign({}, this.dataStore).supportTickets);
      }, error => console.log('could not load support tickets'));
  }

  addSupportTicket(ticket: Support) {
    this.http.post<Support>(`${this.url}/api/support/add-support.php`, JSON.stringify(ticket))
    .subscribe(data => {
      this.dataStore.supportTickets.push(data);
      this._supportTickets.next(Object.assign({}, this.dataStore).supportTickets);
      this.getAllCompanyTickets(ticket.CompanyId, ticket.StatusId);
    }, error => console.log('Could not add a ticket'));
  }

}
