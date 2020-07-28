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
  option: Productoptions;
  constructor(private productService: ProductService
  ) { }

  ngOnInit() {
    this.product$ = this.productService.sellItem;
    this.productService.sellItem.subscribe(data => {
      if (data && data.Productoptions) {
        this.option = data.Productoptions[0];
        this.option.ngClass = ['active'];
      }
    });

  }
  selectImage(option: Productoptions, options: Productoptions[]) {
    options.map(x => x.ngClass = []);
    this.option = option;
    this.option.ngClass = ['active'];
  }

}
