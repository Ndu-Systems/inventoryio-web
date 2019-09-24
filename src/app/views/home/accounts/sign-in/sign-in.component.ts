import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/_models';
import { AccountService } from 'src/app/_services';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  showMobileNav
  rForm: FormGroup;
  error: string;
  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
  ) {
  }
  toggleNav(){
    this.showMobileNav = !this.showMobileNav
  }

  ngOnInit() {
    this.rForm = this.fb.group({
      Email: new FormControl(
       'ndu@mail.com',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])
      ),
      Password: ['1111', Validators.required]
    });

  }

  get getFormValues() {
    return this.rForm.controls;
  }
  Login() {
    const email = this.getFormValues.Email.value;
    const password = this.getFormValues.Password.value;
    this.accountService.login({email, password});

  }

}
