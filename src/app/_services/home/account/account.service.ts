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


  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  url: string;
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  addUser(data: User) {
    return this.http.post<any>(`${this.url}/api/user/add-user.php`, data).subscribe(resp => {
      const user: User = resp;
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }, error => {
      alert(JSON.stringify(error));
    });
  }

  updateUser(user: User) {
    return this.http.post<any>(`${this.url}/api/user/update-user.php`, user).subscribe(resp => {
      const user: User = resp;
      alert(JSON.stringify(resp));
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }, error => {
      alert(JSON.stringify(error));
    });
  }

  login(credentials: { email: any; password: any; }) {
    return this.http.post<any>(`${this.url}/api/user/login.php`, credentials).subscribe(resp => {
      const user: User = resp;
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.router.navigate(['dashboard']);

    }, error => {
      alert(JSON.stringify(error));
    });
  }

  logout() {
    // remove user from local storage to log user out

    localStorage.clear();
    this.currentUserSubject.next(null);
  }

}
