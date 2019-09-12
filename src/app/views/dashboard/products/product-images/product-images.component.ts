import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UploadService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { Image } from 'src/app/_models';

@Component({
  selector: 'app-product-images',
  templateUrl: './product-images.component.html',
  styleUrls: ['./product-images.component.scss']
})
export class ProductImagesComponent implements OnInit {
  @Input() productId?;
  img = 'http://localhost:8200/inventoryiodb-api/images/car.jpg';
  upload: boolean;
  images$: Observable<Image[]>;

  constructor(private router: Router, private uploadService: UploadService) { 
  }

  ngOnInit() {
    this.uploadService.getImages(this.productId);
    this.images$ = this.uploadService.currentsImage;
  }
  add() {
    // this.upload = true;
    this.router.navigate([`dashboard/upload-product-image/${this.productId}`]);
  }
}
