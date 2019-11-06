import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/_services';
import { User, Support } from 'src/app/_models';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-add-support',
  templateUrl: './add-support.component.html',
  styleUrls: ['./add-support.component.scss']
})
export class AddSupportComponent implements OnInit {
  rForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    const user: User = this.accountService.currentUserValue;
    this.rForm = this.fb.group({
      Subject: [null],
      Message: [null, Validators.required],
      CallBack: [false],
      CompanyId: [user.CompanyId, Validators.required],
      CreateUserId: [user.UserId, Validators.required],
      ModifyUserId: [user.UserId, Validators.required],
      StatusId: [1, Validators.required]
    });
  }

  add(support: Support) {
    alert(JSON.stringify(support));
    this.messageService.add(
      {
        severity: 'success',
        summary: 'Success!',
        detail: 'Support request received'
      });
  }

}
