import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/_services';
import { User } from 'src/app/_models';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  rForm: FormGroup;
  error: string;
  loading$ = this.accountService.loading;
  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService
  ) {
  }

  ngOnInit() {
    this.accountService.updateUserState(null);
    this.rForm = this.fb.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])
      ),
      password: ['', Validators.required],
      fullname: ['', Validators.required],
      cell: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
      CompanyId: [null],
    });

  }

  get getFormValues() {
    return this.rForm.controls;
  }
  signUp() {
    const fullname: string = this.getFormValues.fullname.value;
    const cell = this.getFormValues.cell.value;
    const CompanyId = this.getFormValues.CompanyId.value;
    const email = this.getFormValues.email.value;
    const password = this.getFormValues.password.value;
    const passwordConfirm = this.getFormValues.passwordConfirm.value;

    if (password !== passwordConfirm) {
      this.error = `Password must match`;
      alert(this.error);
      return false;
    }

    const data: User = {
      Email: email,
      Name: fullname.split(' ')[0],
      Surname: fullname.split(' ')[1] || '',
      CellphoneNumber: cell,
      Password: password,
      CreateUserId: 'web',
      ModifyUserId: 'web',
      RoleId: 1,
      StatusId: 1,
      CompanyId: ''
    };
    this.accountService.addUser(data);
  }

}
