import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/_models';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AccountService {


  private _user: BehaviorSubject<User>;
  public user: Observable<User>;

  private _loading: BehaviorSubject<boolean>;
  public loading: Observable<boolean>;
  url: string;
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this._user = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this._loading = new BehaviorSubject<boolean>(false);
    this.user = this._user.asObservable();
    this.loading = this._loading.asObservable();
    this.url = environment.API_URL;
  }

  public get currentUserValue(): User {
    return this._user.value;
  }

  updateUserState(user: User) {
    this._user.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }
  addUser(data: User) {
    this._loading.next(true);

    return this.http.post<any>(`${this.url}/api/user/add-user.php`, data).subscribe(resp => {
      const user: User = resp;
      localStorage.clear();
      this.updateUserState(user);
      this._loading.next(false);

      user.CompanyId = 'n/a';
      this.router.navigate(['dashboard']);
    }, error => {
      this._loading.next(false);
      alert(JSON.stringify(error));
    });
  }

  updateUser(user: User) {
    return this.http.post<any>(`${this.url}/api/user/update-user.php`, user).subscribe(resp => {
      const user: User = resp;
      this.updateUserState(user);
    }, error => {
      alert(JSON.stringify(error));
    });
  }

  login(credentials: { email: any; password: any; }) {
    this._loading.next(true);
    return this.http.post<any>(`${this.url}/api/user/login.php`, credentials).subscribe(resp => {
      const user: User = resp;
      localStorage.clear();
      this.updateUserState(user);
      this.router.navigate(['dashboard']);
      this._loading.next(false);


    }, error => {
      this._loading.next(false);
      alert(JSON.stringify(error));
    });
  }

  logout() {
    localStorage.clear();
    this.updateUserState(null);
  }

}
