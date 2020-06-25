import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User, ForgotPasswordModel } from 'src/app/_models';
import { Router } from '@angular/router';
import { SplashService } from '../../splash.service';
import { COMMON_CONN_ERR_MSG } from 'src/app/_shared';
import { RolesService } from '../../dashboard';
import { ForgotPasswordComponent } from 'src/app/views/home/accounts';


@Injectable({
  providedIn: 'root'
})
export class AccountService {


  private _user: BehaviorSubject<User>;
  public user: Observable<User>;
  private roleService;
  private _loading: BehaviorSubject<boolean>;
  public loading: Observable<boolean>;
  url: string;
  constructor(
    private http: HttpClient,
    private router: Router,
    private splashService: SplashService,
    roleService: RolesService
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
      if (user.UserType !== 'Customer') {
        localStorage.clear();
      }
      this.updateUserState(user);
      this._loading.next(false);
      if (user.UserType !== 'Customer') {
        this.router.navigate(['dashboard']);
      }
    }, error => {
      this._loading.next(false);
      console.log(error);
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`,
      });
    });
  }
  signUpCustomer(data: User): Observable<User> {
    return this.http.post<any>(`${this.url}/api/user/customer-sign-up.php`, data);
  }
  socialLogin(data) {
    this._loading.next(true);

    return this.http.post<any>(`${this.url}/api/account/social-login.php`, data).subscribe(resp => {
      const user: User = resp;
      localStorage.clear();
      this.updateUserState(user);
      this._loading.next(false);
      this.router.navigate(['dashboard']);
    }, error => {
      this._loading.next(false);
      console.log(error);
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`,
      });
    });
  }

  updateUser(user: User) {
    return this.http.post<any>(`${this.url}/api/user/update-user.php`, user).subscribe(resp => {
      const user: User = resp;
      this.updateUserState(user);
    }, error => {
      console.log(error);
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
    });
  }

  login(credentials: { email: any; password: any; }) {
    this._loading.next(true);
    return this.http.post<any>(`${this.url}/api/account/login.php`, credentials).subscribe((resp: User) => {
      if (resp && resp.UserId) {
        const user: User = resp;
        localStorage.clear();
        this._loading.next(false);
        if (user.UserType === 'Customer') {
          this.updateUserState(user);
        } else {
          this.updateUserState(user);
          this.router.navigate(['dashboard']);

        }
      } else {
        this._loading.next(false);
        this.splashService.update({
          show: true, heading: 'Opps',
          message: `Opps wrong login details`,
          class: `error`
        });
      }
    }, error => {
      this._loading.next(false);
      this.splashService.update({
        show: true, heading: 'Network Error',
        message: COMMON_CONN_ERR_MSG,
        class: `error`
      });
    });
  }

  customerLogin(credentials: { email: any; password: any; }): Observable<User> {
    return this.http.post<User>(`${this.url}/api/account/customer-login.php`, credentials);
  }
  forgotPassword(model: ForgotPasswordModel): Observable<User> {
    return this.http.post<User>(`${this.url}/api/account/forgot-password.php`, model);
  }

  getCurrentCustomer() {
    if (localStorage.getItem('user_customer')) {
      return JSON.parse(localStorage.getItem('user_customer'));
    } else {
      return null;
    }
  }

  generateForgotPasswordReturnUrl(token: string): string {
    return `${this.url}/reset-password?token=${token}`;
  }

  getUserByToken(token: string) {
    return this.http.get<any>(`${this.url}/api/user/get-by-token.php?Token=${token}`);
  }
  changePassword(model: ForgotPasswordModel): Observable<any> {
    return this.http.post<any>(`${this.url}/api/account/change-password.php`, model);
  }

  logout() {
    localStorage.clear();
    this.updateUserState(null);
  }

  checkSession() {
    const user: User = this.currentUserValue;
    if (!user) {
      this.logout();
      this.router.navigate(['sign-in']);
    }
  }

}
