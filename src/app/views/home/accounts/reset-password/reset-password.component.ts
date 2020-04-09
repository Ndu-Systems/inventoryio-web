import { Component, OnInit } from '@angular/core';
import { ForgotPasswordModel, User } from 'src/app/_models';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmailService, SmsService, AccountService } from 'src/app/_services';
import { Router } from '@angular/router';
import { FORGOT_PASSWORD_SUBJECT, FORGOT_PASSWORD_BODY } from 'src/app/_shared';
import { LocationStrategy } from '@angular/common';
import { MessageService } from 'primeng/api';

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
  token;
  user: User;
  constructor(
    private fb: FormBuilder,
    private location: LocationStrategy,
    private emailService: EmailService,
    private messageService: MessageService,
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
    const baseUrlMain: string = (this.location as any)._platformLocation.location.href;
    this.token = baseUrlMain.substring(baseUrlMain.indexOf('=') + 1);
    this.getUserByToken();
  }

  getUserByToken() {
    if (!this.token) {
      this.invalidRequestRedirect('You should not be here');
    }
    this.accountService.getUserByToken(this.token).subscribe(data => {
      if (data) {
        this.user = data as User;
      } else {
        this.invalidRequestRedirect('session has expired');
      }
    });
  }

  invalidRequestRedirect(message: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Oops',
      detail: message,
      life: 7000
    });
    setTimeout(() => {
      this.routeTo.navigate(['forgot-password']);
    }, 2000);
  }
  onSubmit(model: ForgotPasswordModel) {
    this.error = '';
    if (model.Password !== model.ConfirmPassword) {
      this.error = 'you password(s) do not match, please check again.';
      this.hasError = true;
      return;
    }
    if (model.Email !== this.user.Email) {
      this.error = 'Invalid email, please check again.';
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
