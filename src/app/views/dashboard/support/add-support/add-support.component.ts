import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService, SupportService, EmailService, SmsService } from 'src/app/_services';
import { User, Support, Email, SmsModel, From } from 'src/app/_models';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-add-support',
  templateUrl: './add-support.component.html',
  styleUrls: ['./add-support.component.scss']
})
export class AddSupportComponent implements OnInit {
  @Output() showTab: EventEmitter<boolean> = new EventEmitter<boolean>();
  rForm: FormGroup;
  user: User;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private supportService: SupportService,
    private accountService: AccountService,
    private emailService: EmailService,
    private smsService: SmsService
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.rForm = this.fb.group({
      CompanyId: [this.user.CompanyId, Validators.required],
      UserId: [this.user.UserId, Validators.required],
      Subject: [null],
      Message: [null, Validators.required],
      CallBack: [false],
      CreateUserId: [this.user.UserId, Validators.required],
      ModifyUserId: [this.user.UserId, Validators.required],
      StatusId: [1, Validators.required]
    });
  }

  add(support: Support) {
    this.supportService.addSupportTicket(support);
    this.messageService.add(
      {
        severity: 'success',
        summary: 'Success!',
        detail: 'Support request received'
      });
    this.rForm.reset();
    const email: Email = {
      CompanyName: this.user.Company.Name,
      EmailType: 'Support Ticket',
      Email: this.user.Email,
      ContactNumber: this.user.CellphoneNumber,
      Subject: support.Subject,
      Message: support.Message
    };
    // this.sendEmailNow(email);
    this.sendSms();
  }

  sendEmailNow(email: Email) {
    this.emailService.sendEmail(email).subscribe(data => {
      console.log(data);
    });
  }

  sendSms() {
    const from: From = {
      type: 'LOCAL',
      address: '1111111'
    };
    const sms: SmsModel = {
      from,
      to: ['test'],
      body: 'Hello from our angular 7 app'

    };
    this.smsService.post(sms);
  }

  goToTickets() {

  }

}
