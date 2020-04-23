import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SocialUser, AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'ng4-social-login';
import { Router } from '@angular/router';
import { AccountService, RolesService, PartnerService } from 'src/app/_services';
import { Title } from '@angular/platform-browser';
import { StatusConstant } from 'src/app/views/dashboard/shared/config';
import { Partner } from 'src/app/_models';
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

  public socialUser: any = SocialUser;
  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private partnerService: PartnerService,
    private roleService: RolesService,
    private titleService: Title,
    private authService: AuthService,
    private messageService: MessageService,

  ) {
  }


  ngOnInit() {
    this.titleService.setTitle(`Login to your vendor account | Inventory io`);

    this.rForm = this.fb.group({
      EmailAddress: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])
      ),
      Name: [null, Validators.required],
      CellphoneNumber: [''],
      Surname: [''],
      Password: [''],
      Address: [''],
      PartnerType: [this.partnerType],
      CompanyId: ['customer-page', Validators.required],
      CreateUserId: ['customer-page', Validators.required],
      ModifyUserId: ['customer-page', Validators.required],
      StatusId: [StatusConstant.ACTIVE_STATUS, Validators.required]
    });


  }

  get getFormValues() {
    return this.rForm.controls;
  }

  onSubmit(partner: Partner) {
    this.partnerService.addPartner(partner);
    this.messageService.add({
      severity: 'success',
      summary: 'Success.',
      detail: `${this.partnerType} ${partner.Name} added successfully`
    });
    // this.routeTo.navigate([this.bannerService.currentBannerValue.backto]);
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
