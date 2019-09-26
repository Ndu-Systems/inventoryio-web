import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User, UserRoleModel, UserStoreModel } from 'src/app/_models';
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

  getById(userId: string) {
    this.http.get<User>(`${this.url}/api/user/get-users-userid.php?UserId=${userId}`)
      .subscribe(data => {
        let notFound = true;
        this.dataStore.users.forEach((item, index) => {
          if (item.UserId == data.UserId) {
            this.dataStore.users[index] = data;
            notFound = false;
          }
        });
        if (notFound) {
          this.dataStore.users.push(data);
        }
      }, error => console.log('Could not load a user'));
  }

  addUser(user: User) {
    this.http.post<User>(`${this.url}/api/user/add-user.php`, JSON.stringify(user))
      .subscribe(data => {
        this.dataStore.users.push(data);
        this._users.next(Object.assign({}, this.dataStore).users);
      }, error => console.log('Could not add a store'));
  }



  updateUser(user: User) {
    this.http.put<User>(`${this.url}/api/user/update-user.php`, JSON.stringify(user))
      .subscribe(data => {
        this.dataStore.users.forEach((item, index) => {
          if (item.UserId === data.UserId) {
            this.dataStore.users[index] = data;
          }
        });
        this._users.next(Object.assign({}, this.dataStore).users);
      }, error => console.log('Could not update a user'));
  }

  getUsersForRole(roleId: number | string) {
    this.http.get<User[]>(`${this.url}/api/user/get-users-roleid.php?RoleId=${roleId}`)
      .subscribe(data => {
        this.dataStore.users = data;
        this._users.next(Object.assign({}, this.dataStore).users);
      }, error => console.log('Could not load users for role'));
  }

  addUserRole(userRole: UserRoleModel) {
    this.http.post<User[]>(`${this.url}/api/user/add-user-role.php`, JSON.stringify(userRole))
      .subscribe(data => {
        this.dataStore.users = data;
        this._users.next(Object.assign({}, this.dataStore).users);
      }, error => console.log('Could not add a user to a role'));
  }

  getUsersForStore(storeId: number | string) {
    this.http.get<User[]>(`${this.url}/api/user/get-all-users.php?StatusId=${storeId}`)
      .subscribe(data => {
        this.dataStore.users = data;
        this._users.next(Object.assign({}, this.dataStore).users);
      }, error => console.log('Could not load a users for store'));
  }

  addUserStore(userStore: UserStoreModel) {
    this.http.post<User[]>(`${this.url}/api/user/add-user-store.php`, JSON.stringify(userStore))
      .subscribe(data => {
        this.dataStore.users = data;
        this._users.next(Object.assign({}, this.dataStore).users);
      }, error => console.log('Could not add a user to a store'));
  }


}
