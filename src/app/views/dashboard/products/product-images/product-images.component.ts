import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UploadService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { Image } from 'src/app/_models';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-product-images',
  templateUrl: './product-images.component.html',
  styleUrls: ['./product-images.component.scss']
})
export class ProductImagesComponent implements OnInit {
  @Input() productId?;
  img = 'http://localhost:8200/inventoryiodb-api/images/car.jpg';
  images$: Observable<Image[]>;

  constructor(private router: Router, private uploadService: UploadService, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.uploadService.getImages(this.productId);
    this.images$ = this.uploadService.images;
  }
  add() {
    this.router.navigate([`dashboard/upload-product-image/${this.productId}`]);
  }
  remove(image: Image) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        image.StatusId = 2;
        this.uploadService.update(image);
      }
    });
  }
}
