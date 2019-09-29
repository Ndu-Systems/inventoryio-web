import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Permission } from 'src/app/_models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private _permissions = new BehaviorSubject<Permission[]>([]);
  private url = environment.API_URL;
  private dataStore: {
    permissions: Permission[]
  } = { permissions: [] };

  readonly permissions = this._permissions.asObservable();

  constructor(private http: HttpClient) { }

  getAllPermissions(companyId: string) {
    this.http.get<Permission[]>(`${this.url}/api/permissions/get-permissions.php?CompanyId=${companyId}`)
      .subscribe(data => {
        this.dataStore.permissions = data;
        this._permissions.next(Object.assign({}, this.dataStore).permissions);
      }, error => console.log('could not load permissions'));
  }

  getById(permissionId: string, companyId: string) {
    this.http.get<Permission>(`${this.url}/api/permissions/get-permissions-id.php?PermissionId=${permissionId}&&CompanyId=${companyId}`)
      .subscribe(data => {
        let notFound = true;
        this.dataStore.permissions.forEach((item, index) => {
          if (item.PermissionId === data.PermissionId) {
            this.dataStore.permissions[index] = data;
            notFound = false;
          }
        });
        if (notFound) {
          this.dataStore.permissions.push(data);
        }
      });
  }

  addPermission(permission: Permission) {
    this.http.post<Permission>(`${this.url}/api/permissions/add-permissions.php`, JSON.stringify(permission))
    .subscribe(data => {
      this.dataStore.permissions.push(data);
      this._permissions.next(Object.assign({}, this.dataStore).permissions);
      }, error => console.log('could not add  permission'));
  }

  updatePermission(permission: Permission){
    this.http.put<Permission>(`${this.url}/api/permissions/update-permissions.php`, JSON.stringify(permission))
    .subscribe(data => {
       this.dataStore.permissions.forEach((item, index) => {
         if(item.PermissionId === data.PermissionId) {
           this.dataStore.permissions[index] = data;
         }
       });
       this.dataStore.permissions.sort((x, y) => {
         return new Date(y.CreateDate).getTime() - new Date(x.CreateDate).getTime();
       });
       this._permissions.next(Object.assign({}, this.dataStore).permissions);
    }, error => console.log('Could not update permission'));
  }



}
