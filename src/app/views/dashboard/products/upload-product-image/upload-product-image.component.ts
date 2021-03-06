import { Component, OnInit } from '@angular/core';
import { User, Image } from 'src/app/_models';
import { DocumentsService, AccountService, UploadService, SpinnerService } from 'src/app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-upload-product-image',
  templateUrl: './upload-product-image.component.html',
  styleUrls: ['./upload-product-image.component.scss']
})
export class UploadProductImageComponent implements OnInit {

  heading = 'Upload';
  backto = '/dashboard/product';
  file: File;
  message: string;
  success: string;
  clientId: any;
  InvestmentId: any;

  user: User;
  productId: any;

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
  }
  filesChanged(files) {
    this.file = files[0] as File;
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
    this.routeTo.navigate([this.backto]);
  }

}
