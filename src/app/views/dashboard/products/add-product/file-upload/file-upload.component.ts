import { Component, OnInit, Input, HostListener, ElementRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DocumentsService, AccountService, UploadService, SpinnerService } from 'src/app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

import { User, Image } from 'src/app/_models';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FileUploadComponent),
    multi: true
  }
  ]
})
export class FileUploadComponent implements ControlValueAccessor {



  private files: FileList | null = null;
  message: string;
  imagePath: any;
  imgURL: any[] = [];

  user: User;
  productId;
  //onChange: () => void;

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const files = event && event;
    this.files = files;
    this.uplaodFile();

  }

  constructor(
    private host: ElementRef<HTMLInputElement>,
    private documentsService: DocumentsService,
    private accountService: AccountService,
    private uploadService: UploadService,
    private routeTo: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private spinnerService: SpinnerService
  ) {
  }
  writeValue(obj: any): void {
    this.files = obj ? obj : undefined;
  }

  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  uplaodFile() {
    if (!this.files.length) {
      this.message = 'Please select the files!';
      return false;
    }

    Array.from(this.files).forEach(file => {
      this.documentsService.uploadFile(file).subscribe(response => {
        this.imgURL.push(`${environment.API_URL}/api/upload/${response}`);
        this.uploadService.updateState(this.imgURL);
        console.log(response);
      });
    });

  }
}
