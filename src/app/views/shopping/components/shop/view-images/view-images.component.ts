import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { Product, Image } from 'src/app/_models';
import { Productoptions } from 'src/app/_models/productoptions.model';

@Component({
  selector: 'app-view-images',
  templateUrl: './view-images.component.html',
  styleUrls: ['./view-images.component.scss']
})
export class ViewImagesComponent implements OnInit {
  product$: Observable<Product>;
  selectedImage: string;
  constructor(private productService: ProductService
  ) { }

  ngOnInit() {
    this.product$ = this.productService.sellItem;
    this.productService.sellItem.subscribe(data => {
      if (data && data.Productoptions) {
        this.selectedImage = data.Productoptions[0] && data.Productoptions[0].ImageUrl1 || '';
      }
    });

  }
  selectImage(image: string) {
    this.selectedImage = image;
  }

}
