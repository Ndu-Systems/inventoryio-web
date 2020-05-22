import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SocialUser, AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'ng4-social-login';
import { Router } from '@angular/router';
import { AccountService, RolesService } from 'src/app/_services';
import { Title } from '@angular/platform-browser';
import { ShoppingService } from 'src/app/_services/home/shoping';

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
  shopSecondaryColor;
  shopPrimaryColor;
  logoUrl;
  public socialUser: any = SocialUser;
  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private roleService: RolesService,
    private authService: AuthService,
    private shoppingService: ShoppingService,

  ) {
  }


  ngOnInit() {
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
    this.accountService.customerLogin({ email, password }).subscribe(user => {
      if (user && user.UserId && Number(user.RoleId) === 3) {
        this.shoppingService.updateCustomerState(user);
        this.shoppingService.updateModalState(false);
        this.error = '';
        // this.usersService.updateUserAysnc(data).subscribe(user => {
        //   console.log(user);
        //   localStorage.setItem('user_customer', JSON.stringify(user));
        // });
      } else {
        this.error = 'Incorrect email or password, try again';
      }
    });
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
