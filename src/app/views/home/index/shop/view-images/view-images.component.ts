import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { Product } from 'src/app/_models';

@Component({
  selector: 'app-view-images',
  templateUrl: './view-images.component.html',
  styleUrls: ['./view-images.component.scss']
})
export class ViewImagesComponent implements OnInit {
  product$: Observable<Product>;
  images: any[] = [];
  constructor(private productService: ProductService
  ) { }

  ngOnInit() {
    this.product$ = this.productService.sellItem;
    this.productService.sellItem.subscribe(data => {
      data.images.forEach(image => {
        this.images.push({ source: image.Url, alt: '', title: '' });
      });
    });

  }

}
