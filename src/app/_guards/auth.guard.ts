import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AccountService } from '../_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private routeTo: Router,
    private accountService: AccountService
  ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.accountService.currentUserValue;
    if (currentUser) {
      if (route.data.roles) {
        this.routeTo.navigate(['/dashboard']);
        return false;
      }
      return true;
    }
    this.accountService.logout();
    this.routeTo.navigate(['sign-in']);
    return false;
  }
}
