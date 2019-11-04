import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UploadService, DocumentsService, AccountService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { Image, User } from 'src/app/_models';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-images',
  templateUrl: './product-images.component.html',
  styleUrls: ['./product-images.component.scss']
})
export class ProductImagesComponent implements OnInit {
  @Input() productId?;
  images$: Observable<Image[]>;
  files: FileList;
  user: User;
  imgURLs: any[] = [];

  constructor(
    private router: Router,
    private uploadService: UploadService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private documentsService: DocumentsService,
    private accountService: AccountService,
  ) {
  }

  ngOnInit() {
    this.uploadService.getImages(this.productId);
    this.images$ = this.uploadService.images;
    this.user = this.accountService.currentUserValue;
  }
  add() {
    this.router.navigate([`dashboard/upload-product-image/${this.productId}`]);
  }
  remove(image: Image) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        image.StatusId = 2;
        image.OtherId = `removed-${image.OtherId}`;
        this.uploadService.update(image);
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Image removed! '
        });
      }
    });
  }

  // upload images
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
      OtherId: this.productId,
      Url: `${environment.API_URL}/api/upload/${url}`,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    };
    this.uploadService.addImage(data);
    this.messageService.add({
      severity: 'success',
      summary: 'Success!',
      detail: 'Image  uploaded '
    });
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
