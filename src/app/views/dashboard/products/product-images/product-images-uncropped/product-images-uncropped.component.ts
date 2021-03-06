import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UploadService, DocumentsService, AccountService } from 'src/app/_services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { Image, User } from 'src/app/_models';


@Component({
  selector: 'app-product-images-uncropped',
  templateUrl: './product-images-uncropped.component.html',
  styleUrls: ['./product-images-uncropped.component.scss']
})
export class ProductImagesUncroppedComponent implements OnInit {

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

      let formData = new FormData();
      formData.append('file', file);
      formData.append('name', 'iio');
      this.documentsService.uploadFile(formData).subscribe(response => {
        //  this.imgURL.push(`${environment.API_URL}/api/upload/${response}`);
        // this.uploadService.updateState(this.imgURL);
        this.saveImage(response);
        console.log(response);
      });

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



}
