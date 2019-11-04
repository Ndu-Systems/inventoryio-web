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
      // this.documentsService.uploadFile(file).subscribe(response => {
      //   this.saveImage(response);
      // });
      this.cropImage(file);
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
      detail: 'Profile image  updated, please logout and login again.'
    });

    this.user.Dp = ` ${environment.API_URL}/api/upload/${url}`;
    this.accountService.updateUserState(this.user);
  }

  cropImage(file) {
    if (file.type.match(/image.*/)) {
      console.log('An image has been loaded');

      const reader = new FileReader();
      reader.onload = (readerEvent: any) => {
        const image = new Image();
        image.onload = (imageEvent) => {

          // Resize the image
          const canvas = document.createElement('canvas');
          const maxSize = 544; // TODO : pull max size from a site config
          let width = image.width;
          let height = image.height;
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(image, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          const resizedImage = this.dataURLToBlob(dataUrl);
          let fileOfBlob = new File([resizedImage], 'iio.jpg');
          // upload
          let formData = new FormData();
          formData.append('file', fileOfBlob);
          formData.append('name', 'iio');
          this.documentsService.uploadFile(formData).subscribe(response => {
            //  this.imgURL.push(`${environment.API_URL}/api/upload/${response}`);
            // this.uploadService.updateState(this.imgURL);
            this.saveImage(response);
            console.log(response);
          });

        };
        image.src = readerEvent.target.result.toString();
      };
      reader.readAsDataURL(file);
    }
  }
  dataURLToBlob(dataURL) {
    const BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      // tslint:disable-next-line: no-shadowed-variable
      const parts = dataURL.split(',');
      // tslint:disable-next-line: no-shadowed-variable
      const contentType = parts[0].split(':')[1];
      // tslint:disable-next-line: no-shadowed-variable
      const raw = parts[1];

      return new Blob([raw], { type: contentType });
    }

    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }

}
