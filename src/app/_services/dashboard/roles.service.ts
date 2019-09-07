import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role } from 'src/app/_models/roles.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private currentRoleSubject: BehaviorSubject<Role[]>;
  public currentRole: Observable<Role[]>;
  url: string;
  constructor(
    private http: HttpClient
  ) {
    this.currentRoleSubject = new BehaviorSubject<Role[]>(JSON.parse(localStorage.getItem('currentRole')));
    this.currentRole = this.currentRoleSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentRoleValue(): Role[] {
    return this.currentRoleSubject.value;
  }

  addRole(data: Role) {
    return this.http.post<any>(`${this.url}/api/roles/add-role.php`, data).subscribe(resp => {
      alert(JSON.stringify(resp));
      const role: Role[] = resp;
      localStorage.setItem('currentRole', JSON.stringify(role));
      this.currentRoleSubject.next(role);
    }, error => {
      alert(JSON.stringify(error));
    });
  }

  getRoles(companyId) {
    return this.http.get<any>(`${this.url}/api/roles/get-roles.php?CompanyId=${companyId}`).subscribe(resp => {
      alert(JSON.stringify(resp));
      const role: Role[] = resp;
      localStorage.setItem('currentRole', JSON.stringify(role));
      this.currentRoleSubject.next(role);
    }, error => {
      alert(JSON.stringify(error));
    });
  }

}
