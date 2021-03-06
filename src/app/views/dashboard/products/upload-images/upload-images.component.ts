import { Component, OnInit } from '@angular/core';
import { DocumentsService, AccountService, UploadService } from 'src/app/_services';
import { Image, User } from 'src/app/_models';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.scss']
})
export class UploadImagesComponent implements OnInit {
  file: File;
  message: string;
  success: string;
  clientId: any;
  InvestmentId: any;

  user: User;

  constructor(
    private documentsService: DocumentsService,
    private accountService: AccountService,
    private uploadService: UploadService,
    private routeTo: Router
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (! this.user) {
      this.routeTo.navigate(['sign-in']);
    }
  }
  filesChanged(files) {
    this.file = files[0] as File;
  }
  uplaodFile() {
    if (!this.file) {
      this.message = 'Please select the files!';
      return false;
    }
    this.documentsService.uploadFile(this.file).subscribe(response => {
      this.saveImage(response);
    });
  }

  saveImage(url) {
    const data: Image = {
      CompanyId: this.user.CompanyId,
      OtherId: 'mmm',
      Url: `${environment.API_URL}/api/upload/${url}`,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    };
    this.uploadService.addImage(data);
  }

}
