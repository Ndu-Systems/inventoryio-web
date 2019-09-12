import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-images',
  templateUrl: './product-images.component.html',
  styleUrls: ['./product-images.component.scss']
})
export class ProductImagesComponent implements OnInit {
  img = 'http://localhost:8200/inventoryiodb-api/images/car.jpg';

  constructor() { }

  ngOnInit() {
  }

}
