import { Component, OnInit } from '@angular/core';
import { AccountService, PermissionsService, RolesService } from 'src/app/_services';
import { User, Splash, Role, Permission, SystemPermissionModel } from 'src/app/_models';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SpinnerService } from 'src/app/_services/dashboard/spinner.service';
import { SplashService } from 'src/app/_services/splash.service';
import { SharedService } from './shared/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  showMessage;
  messages: string[];
  class: string;
  img: string;
  link: string;
  linkname: string;
  heading: string[];
  spinner$: Observable<boolean>;
  splash$: Observable<Splash>;
  userRoles: Role[];
  userPermissions: SystemPermissionModel[];
  user: User;


  constructor(
    private accountService: AccountService,
    private router: Router,
    private spinnerService: SpinnerService,
    private splashService: SplashService,
    private roleService: RolesService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.spinner$ = this.spinnerService.spinner;
    this.splash$ = this.splashService.splash;
    this.user = this.accountService.currentUserValue;
    this.accountService.checkSession();
  }


}
