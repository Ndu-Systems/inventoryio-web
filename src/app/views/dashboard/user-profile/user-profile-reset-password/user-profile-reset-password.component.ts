import { Component, OnInit } from '@angular/core';
import { BannerService, UsersService, AccountService } from 'src/app/_services';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/_models';
import { PASSWORD_DONT_MATCH, PASSWORD_MINIMUM_LENGTH, PASSWORD_LENGTH, PASSWORD_CANT_BE_OLD_PASSWORD } from '../../shared';

@Component({
  selector: 'app-user-profile-reset-password',
  templateUrl: './user-profile-reset-password.component.html',
  styleUrls: ['./user-profile-reset-password.component.scss']
})
export class UserProfileResetPasswordComponent implements OnInit {
  rForm: FormGroup;
  user: User;
  errors;
  banner;
  constructor(
    private fb: FormBuilder,
    private bannerService: BannerService,
    private userService: UsersService,
    private accountService: AccountService,
    private routeTo: Router
  ) { }

  ngOnInit() {
    this.banner = this.bannerService.currentsBanner;
    this.user = this.accountService.currentUserValue;
    this.rForm = this.fb.group({
      UserId: [this.user.UserId],
      Email: [this.user.Email],
      Surname: [this.user.Surname],
      Name: [this.user.Name],
      CellphoneNumber: [this.user.CellphoneNumber],
      Password: [this.user.Password],
      CompanyId: [this.user.CompanyId],
      CreateUserId: [this.user.CreateUserId],
      ModifyUserId: [this.user.ModifyUserId],
      StatusId: [this.user.StatusId],
      NewPassword: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.pattern('[0-9 ]*')
        ]))
      ,
      ConfirmPassword: [null, Validators.required]
    });
  }

  onSubmit(user: User) {
    this.errors = undefined;
    if (user.NewPassword.toLocaleString().length < PASSWORD_MINIMUM_LENGTH) {
      this.errors = PASSWORD_LENGTH;
      return;
    }
    if (user.NewPassword !== user.ConfirmPassword) {
      this.errors = PASSWORD_DONT_MATCH;

      return;
    }
    if (user.NewPassword === user.Password) {
      this.errors = PASSWORD_CANT_BE_OLD_PASSWORD;
      return;
    }
    user.Password = user.NewPassword;
    this.userService.updateUser(user);
    this.routeTo.navigate(['sign-in']);
  }

}
