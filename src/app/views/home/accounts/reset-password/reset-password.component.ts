import { Component, OnInit } from '@angular/core';
import { ForgotPasswordModel } from 'src/app/_models';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmailService, SmsService, AccountService } from 'src/app/_services';
import { Router } from '@angular/router';
import { FORGOT_PASSWORD_SUBJECT, FORGOT_PASSWORD_BODY } from 'src/app/_shared';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  rForm: FormGroup;
  showMobileNav;
  error: string;
  loading$: Observable<boolean>;
  email = environment.TEST_EMAIL_ACCOUNT;
  hasError: boolean;
  hidePassword = true;
  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private smsService: SmsService,
    private accountService: AccountService,
    private routeTo: Router
  ) { }

  ngOnInit() {
    this.rForm = this.fb.group({
      Email: new FormControl(
        this.email,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])
      ),
      Password: [null, Validators.required],
      ConfirmPassword: [null, Validators.required]
    });
  }
  onSubmit(model: ForgotPasswordModel) {
    this.error = '';
    if (model.Password !== model.ConfirmPassword) {
      this.error = 'you password(s) do not match, please check again.';
      this.hasError = true;
      return;
    }
    this.accountService.changePassword(model).subscribe(data => {
      if (data === 1) {
         this.routeTo.navigate(['/sign-in']);
      }
    });
  }

}
