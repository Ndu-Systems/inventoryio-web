import { Role } from './../../../../_models/roles.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService, RolesService } from 'src/app/_services';
import { User } from 'src/app/_models';
import { SplashService } from 'src/app/_services/splash.service';
import { Title } from '@angular/platform-browser';
import { AuthService, SocialUser, GoogleLoginProvider, FacebookLoginProvider } from 'ng4-social-login';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  rForm: FormGroup;
  error: string;
  loading$ = this.accountService.loading;
  role: Role;
  hidePassword = true;
  public socialUser: any = SocialUser;


  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private splashService: SplashService,
    private titleService: Title,
    private authService: AuthService,


  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(`Create a new vendor account | Inventory io`);

    this.accountService.updateUserState(null);
    this.rForm = this.fb.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])
      ),
      password: ['', Validators.required],
      fullname: ['', Validators.required],
      cell: [''],
      companyName: [''],
      // passwordConfirm: ['', Validators.required]
    });

  }

  get getFormValues() {
    return this.rForm.controls;
  }
  signUp() {
    const fullname: string = this.getFormValues.fullname.value;
    const cell = this.getFormValues.cell.value;
    const companyName = this.getFormValues.companyName.value;
    const email = this.getFormValues.email.value;
    const password = this.getFormValues.password.value;
    const data: User = {
      Email: email,
      Name: fullname.split(' ')[0],
      Surname: fullname.split(' ')[1] || '',
      CellphoneNumber: cell,
      CompanyName: companyName,
      Password: password,
      CreateUserId: 'web',
      ModifyUserId: 'web',
      RoleId: 1,
      StatusId: 1
    };
    this.accountService.addUser(data);

  }

  fbLogin() {
    this.authService.signIn(
      FacebookLoginProvider.PROVIDER_ID
    )
      .then(userData => {
        this.socialUser = userData;
        this.accountService.socialLogin(userData);
      });
  }

  googleLogin() {
    this.authService.signIn(
      GoogleLoginProvider.PROVIDER_ID
    )
      .then(userData => {
        this.socialUser = userData;
        this.accountService.socialLogin(userData);

      });
  }


}
