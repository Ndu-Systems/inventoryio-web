import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upload-preview',
  templateUrl: './upload-preview.component.html',
  styleUrls: ['./upload-preview.component.scss']
})
export class UploadPreviewComponent implements OnInit {

url = `${environment.API_URL}api/upload/upload.php`;
  uploadedFiles: any[] = [];

  constructor(private messageService: MessageService) { }
  ngOnInit() {
  }
  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }
}
