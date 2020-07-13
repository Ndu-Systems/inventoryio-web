import { Component, OnInit } from '@angular/core';
import { User, Image } from 'src/app/_models';
import { DocumentsService, AccountService, UploadService, SpinnerService } from 'src/app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-upload-preview',
  templateUrl: './upload-preview.component.html',
  styleUrls: ['./upload-preview.component.scss']
})
export class UploadPreviewComponent implements OnInit {
  heading = 'Upload';
  backto = '/dashboard/product';
  file: File;
  files: File[];
  message: string;
  success: string;
  clientId: any;
  InvestmentId: any;

  user: User;
  productId: any;
  fullUrl: string;

  constructor(
    private documentsService: DocumentsService,
    private accountService: AccountService,
    private uploadService: UploadService,
    private routeTo: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private spinnerService: SpinnerService
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.productId = r.id;
      this.backto = `/dashboard/product-details`;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.accountService.checkSession();
    // this.cropImage();
  }
  filesChanged(files) {
    console.log(files);
    this.files = files;

    this.file = files[0] as File;
    const time = new Date().getTime();
    const extention = this.file.name.split('.')[this.file.name.split('.').length - 1];
    const newfilename = `${time}.${extention}`;
    const myNewFile = new File([this.file], newfilename, { type: this.file.type });
    this.file = myNewFile;
    console.log(this.file);

  }
  uplaodFile() {
    if (!this.file) {
      this.message = 'Please select the files!';
      return false;
    }
    this.spinnerService.show();
    this.documentsService.uploadFile(this.file).subscribe(response => {
      this.saveImage(response);
      this.spinnerService.show();

    });
  }

  saveImage(url) {
    this.fullUrl = `${environment.API_URL}/api/upload/${url}`;
    const data: Image = {
      CompanyId: this.user.CompanyId,
      OtherId: this.productId,
      Url: `${environment.API_URL}/api/upload/${url}`,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    };
    this.uploadService.addImage(data);
    // this.routeTo.navigate([this.backto]);
  }
  cropImage() {
    const canvas: any = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {

      // set size proportional to image
      canvas.height = canvas.width * (img.height / img.width);

      // step 1 - resize to 50%
      const oc = document.createElement('canvas');
      const octx = oc.getContext('2d');

      oc.width = img.width * 0.5;
      oc.height = img.height * 0.5;
      octx.drawImage(img, 0, 0, oc.width, oc.height);

      // step 2
      octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

      // step 3, resize to final size
      ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5,
        0, 0, canvas.width, canvas.height);
    };
    img.src = '//i.imgur.com/SHo6Fub.jpg';
  }
}
