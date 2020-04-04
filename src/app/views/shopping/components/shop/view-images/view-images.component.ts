import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { Product, Image } from 'src/app/_models';

@Component({
  selector: 'app-view-images',
  templateUrl: './view-images.component.html',
  styleUrls: ['./view-images.component.scss']
})
export class ViewImagesComponent implements OnInit {
  product$: Observable<Product>;
  images: Image[] = [];
  selectedImage: Image;
  constructor(private productService: ProductService
  ) { }

  ngOnInit() {
    this.product$ = this.productService.sellItem;
    this.productService.sellItem.subscribe(data => {
      this.images = data.images;
      this.selectedImage =  this.images && this.images[0];
    });

  }
  selectImage(image: Image) {
    this.selectedImage = image;
  }

}
