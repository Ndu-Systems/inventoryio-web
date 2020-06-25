import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SocialUser, AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'ng4-social-login';
import { Router } from '@angular/router';
import { AccountService, RolesService, PartnerService, UsersService } from 'src/app/_services';
import { Title } from '@angular/platform-browser';
import { StatusConstant } from 'src/app/views/dashboard/shared/config';
import { Partner, User } from 'src/app/_models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-customer-signup',
  templateUrl: './customer-signup.component.html',
  styleUrls: ['./customer-signup.component.scss']
})
export class CustomerSignupComponent implements OnInit {

  showMobileNav;
  rForm: FormGroup;
  error: string;
  loading$: Observable<boolean>;
  email = '';
  password = '';
  hidePassword = true;
  partnerType = 'customer';
  shopSecondaryColor;
  shopPrimaryColor;
  logoUrl;

  public socialUser: any = SocialUser;
  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private partnerService: PartnerService,
    private roleService: RolesService,
    private titleService: Title,
    private authService: AuthService,
    private messageService: MessageService,
    private userService: UsersService,
    private accountService: AccountService,

  ) {
  }


  ngOnInit() {
    this.titleService.setTitle(`Create customer account | Tybo | Take your business online`);

    this.rForm = this.fb.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])
      ),
      password: ['00000', Validators.required],
      fullname: ['', Validators.required],
      cell: [''],
      address: [''],
      siginUp: [null]
      // passwordConfirm: ['', Validators.required]
    });


  }

  get getFormValues() {
    return this.rForm.controls;
  }
  addUser() {
    const fullname: string = this.getFormValues.fullname.value;
    const cell = this.getFormValues.cell.value;
    const email = this.getFormValues.email.value;
    const password = this.getFormValues.password.value;
    const address = this.getFormValues.address.value;
    const siginUp = this.getFormValues.siginUp.value;
    if (siginUp) {
      // send account action vation email
    }
    const data: User = {
      Email: email,
      Name: fullname.split(' ')[0],
      Surname: fullname.split(' ')[1] || '',
      CellphoneNumber: cell,
      CompanyName: '',
      Password: '00000',
      CreateUserId: 'web',
      ModifyUserId: 'web',
      Address: address,
      RoleId: 1,
      StatusId: 1
    };
    this.accountService.addUser(data);

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
        // this.accountService.socialLogin(userData);
      });
  }

  googleLogin() {
    this.authService.signIn(
      GoogleLoginProvider.PROVIDER_ID
    )
      .then(userData => {
        this.socialUser = userData;
        // this.accountService.socialLogin(userData);

      });
  }


}
