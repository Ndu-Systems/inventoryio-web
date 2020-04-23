import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SocialUser, AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'ng4-social-login';
import { Router } from '@angular/router';
import { AccountService, RolesService } from 'src/app/_services';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-customer-login',
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.scss']
})
export class CustomerLoginComponent implements OnInit {
  showMobileNav;
  rForm: FormGroup;
  error: string;
  loading$: Observable<boolean>;
  email = environment.ACCOUNT_TEST_EMAIL;
  password = environment.ACCOUNT_TEST_PASSWORD;
  hidePassword = true;

  public socialUser: any = SocialUser;
  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private roleService: RolesService,
    private titleService: Title,
    private authService: AuthService,

  ) {
  }


  ngOnInit() {
    this.titleService.setTitle(`Login to your vendor account | Inventory io`);

    this.rForm = this.fb.group({
      Email: new FormControl(
        this.email,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])
      ),
      Password: [this.password, Validators.required]
    });
    this.loading$ = this.accountService.loading;


  }

  get getFormValues() {
    return this.rForm.controls;
  }

  Login() {
    const email = this.getFormValues.Email.value;
    const password = this.getFormValues.Password.value;
    this.accountService.login({ email, password });

  }

  toggleNav() {
    this.showMobileNav = !this.showMobileNav;
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
