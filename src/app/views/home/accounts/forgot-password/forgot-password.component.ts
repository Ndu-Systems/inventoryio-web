import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmailService, SmsService, AccountService } from 'src/app/_services';
import { FORGOT_PASSWORD_BODY, FORGOT_PASSWORD_SUBJECT } from 'src/app/_shared';
import { ForgotPasswordModel } from 'src/app/_models/forgot-password.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  rForm: FormGroup;
  showMobileNav;
  error: string;
  loading$: Observable<boolean>;
  email = environment.TEST_EMAIL_ACCOUNT;

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
      Subject: [FORGOT_PASSWORD_SUBJECT],
      Message: [FORGOT_PASSWORD_BODY],
    });
  }
  onSubmit(model: ForgotPasswordModel) {
    this.accountService.forgotPassword(model).subscribe(data => {
      if (data === 1) {
         this.routeTo.navigate(['/reset-password']);
      }
    });
  }
}
