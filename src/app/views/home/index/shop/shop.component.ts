import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/_models';
import { ProductService } from 'src/app/_services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  welocme = 'Welcome to Ndu Systems shopping page';
  products$: Observable<Product[]>;
  companyId

  constructor(private productService: ProductService,     private activatedRoute: ActivatedRoute,

  ) { 


    this.activatedRoute.params.subscribe(r => {
      this.companyId = r.id;
      this.productService.getProducts(this.companyId);
      this.products$ = this.productService.products;
    });
  }

  ngOnInit() {
  }

}
