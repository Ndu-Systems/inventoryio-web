import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Role } from 'src/app/_models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private _roles = new BehaviorSubject<Role[]>([]);
  private url = environment.API_URL;
  private dataStore: {
    roles: Role[]
  } = { roles: [] };
  readonly roles = this._roles.asObservable();

  constructor(private http: HttpClient) { }
  getAllRoles(companyId: string) {
    this.http.get<Role[]>(`${this.url}/api/roles/get-roles.php?CompanyId=${companyId}`)
      .subscribe(data => {
        this.dataStore.roles = data;
        this._roles.next(Object.assign({}, this.dataStore).roles);
      }, error => console.log('Could not load roles.'));
  }

  getById(companyId, roleId) {
    this.http.get<Role>(`${this.url}/api/roles/get-roles-id.php?CompanyId=${companyId}&&RoleId=${roleId}`)
      .subscribe(data => {
        let notFound = true;
        this.dataStore.roles.forEach((item, index) => {
          if (item.RoleId === data.RoleId) {
            this.dataStore.roles[index] = data;
            notFound = false;
          }
        });
        if (notFound) {
          this.dataStore.roles.push(data);
        }
      }, error => console.log('could not load role.'));
  }

  addRole(role: Role) {
    this.http.post<Role>(`${this.url}/api/roles/add-role.php?`, JSON.stringify(role))
      .subscribe(data => {
        this.dataStore.roles.push(data);
        this._roles.next(Object.assign({}, this.dataStore).roles);
      }, error => console.log('could create role.'));
  }

  updateRole(role: Role) {
    this.http.put<Role>(`${this.url}/api/roles/update-roles.php?`, JSON.stringify(role))
      .subscribe(data => {
        this.dataStore.roles.forEach((item, index) => {
          if (item.RoleId === data.RoleId) {
            this.dataStore.roles[index] = data;
          }
        });
        this._roles.next(Object.assign({}, this.dataStore).roles);
      }, error => console.log('could not update todo'));
  }
}
