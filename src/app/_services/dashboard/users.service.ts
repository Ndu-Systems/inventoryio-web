import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from 'src/app/_models';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private _users = new BehaviorSubject<User[]>([]);
  private url = environment.API_URL;
  private dataStore: {
    users: User[]
  } = { users: [] };
  readonly users = this._users.asObservable();
  constructor(private http: HttpClient) { }

  getAllUsers(companyId: string) {
    this.http.get<User[]>(`${this.url}/api/user/get-users.php?CompanyId=${companyId}`)
    .subscribe(data => {
      this.dataStore.users = data;
      this._users.next(Object.assign({}, this.dataStore).users);
    }, error => console.log('Could not log users'));
  }
}
