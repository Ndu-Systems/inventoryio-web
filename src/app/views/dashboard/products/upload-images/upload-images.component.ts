import { Component, OnInit } from '@angular/core';
import { DocumentsService } from 'src/app/_services';

@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.css']
})
export class UploadImagesComponent implements OnInit {
  file: File;
  message: string;
  success: string;
  clientId: any;
  InvestmentId: any;
  UserId: any;

  constructor(
    private documentsService: DocumentsService,
  ) { }

  ngOnInit() {
  }
  filesChanged(files) {
    this.file =  files[0] as File;

  }
  uplaodFile() {
    if (!this.file) {
      this.message = 'Please select the files!';
      return false;
    }
    this.documentsService.uploadFile(this.file).subscribe(response => {
      alert(response);
    });
  }

}
