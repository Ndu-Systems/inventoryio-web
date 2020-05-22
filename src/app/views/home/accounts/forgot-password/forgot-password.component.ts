import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmailService, SmsService, AccountService } from 'src/app/_services';
import { FORGOT_PASSWORD_BODY, FORGOT_PASSWORD_SUBJECT } from 'src/app/_shared';
import { ForgotPasswordModel } from 'src/app/_models/forgot-password.model';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { Email } from 'src/app/_models';

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
    private routeTo: Router,
    private messageService: MessageService,
    private titleService: Title

  ) { }

  ngOnInit() {
    this.titleService.setTitle(`Reset vendor account  password | Tybo | Take your business online`);

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
      if (data.UserId) {
        //  this.routeTo.navigate(['/reset-password']);
        const email: Email = {
          CompanyName: '',
          EmailType: '',
          Email: model.Email,
          ContactNumber: data.CellphoneNumber,
          Subject: `${model.Subject} for ${data.Name} ${data.Surname}`,
          Message: '',
          DownloadLink: this.accountService.generateForgotPasswordReturnUrl(data.SecurityToken)
        };
        this.emailService.sendResetPasswordEmail(email).subscribe( data => {
          if (data) {
            this.messageService.add({
              severity: 'success',
              summary: 'Account validated',
              detail: 'Please check your email',
              life: 100000
            });
            this.routeTo.navigate(['']);
          }
        });
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Invalid account!',
          detail: 'Email entered does not exist',
          life: 7000
        });
      }
    });
  }
}
