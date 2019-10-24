import { Component, OnInit } from '@angular/core';
import { BannerService, UsersService, AccountService, DocumentsService, UploadService } from 'src/app/_services';
import { Router } from '@angular/router';
import { User, Image } from 'src/app/_models';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: User;
  files: FileList;
  constructor(
    private bannerService: BannerService,
    private userService: UsersService,
    private accountService: AccountService,
    private routeTo: Router,
    private documentsService: DocumentsService,
    private uploadService: UploadService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.user = this.userService.currentUserValue;
    if (!this.user) {
      this.accountService.logout();
      this.routeTo.navigate(['sign-in']);
    }
    this.bannerService.updateState({
      heading: 'Your Profile',
      backto: '/dashboard'
    });
  }

  // update DP

  onChange(event: FileList) {
    const files = event && event;
    this.files = files;
    this.uplaodFile();
  }
  uplaodFile() {
    if (!this.files.length) {
      return false;
    }

    Array.from(this.files).forEach(file => {
      this.documentsService.uploadFile(file).subscribe(response => {
        this.saveImage(response);
      });
    });

  }

  saveImage(url) {
    const data: Image = {
      CompanyId: this.user.CompanyId,
      OtherId: this.user.UserId,
      Url: `${environment.API_URL}/api/upload/${url}`,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    };
    this.uploadService.addImage(data);
    this.messageService.add({
      severity: 'success',
      summary: 'Success!',
      detail: 'Profile image  updated '
    });

    this.user.Dp = ` ${environment.API_URL}/api/upload/${url}`;
    this.accountService.updateUserState(this.user);
  }

}
