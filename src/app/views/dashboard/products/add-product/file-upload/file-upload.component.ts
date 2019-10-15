import { Component, OnInit, Input, HostListener, ElementRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
  imgURL: string[] = [];

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const files = event && event;
    this.files = files;
    console.log(files);
    this.preview(files);

  }

  constructor(private host: ElementRef<HTMLInputElement>) {
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

  preview(files: FileList) {
    if (!files.length) {
      return;
    }
    for (let i = 0; i < files.length; i++) {
      const mimeType = files[i].type;
      if (mimeType.match(/image\/*/) == null) {
        this.message = 'Only images are supported.';
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onload = (event) => {
        this.imgURL.push(reader.result.toString());
      };
    }



  }
}
