import { SharedService } from './../views/dashboard/shared/shared.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AccountService, RolesService } from '../_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private routeTo: Router,
    private accountService: AccountService,
    private roleService: RolesService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.accountService.currentUserValue;
    let found = true;
    if (currentUser) {
      this.roleService.getRolePermissions(currentUser.RoleId.toString()).subscribe(response => {
        const allowedPermissions = response.filter(x => x.Name.toLocaleUpperCase() === route.data.role);

        if (allowedPermissions.length === 0 ) {
          this.routeTo.navigate(['/dashboard/']);
          found = false;
        }
      });
      return found;
    } else {
    this.accountService.logout();
    this.routeTo.navigate(['sign-in']);
    }
  }
}
