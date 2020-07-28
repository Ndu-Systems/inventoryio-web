import { Component, OnInit } from '@angular/core';
import { CateroryService } from 'src/app/_services/dashboard';
import { Caterory, Company, Product } from 'src/app/_models';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/_services';

@Component({
  selector: 'app-shop-by-category',
  templateUrl: './shop-by-category.component.html',
  styleUrls: ['./shop-by-category.component.scss']
})
export class ShopByCategoryComponent implements OnInit {
  catergory: Caterory;
  catergoryId: string;
  company: Company;
  constructor(
    private cateroryService: CateroryService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.catergoryId = r.id;
      this.cateroryService.getCatergoryById(this.catergoryId).subscribe(data => {
        if (data) {
          this.catergory = data;
          this.company = this.catergory.Company;
        }
      });
    });
  }

  ngOnInit() {

  }

  back() {
    this.router.navigate(['at', this.company.Handler || this.company.CompanyId]);
  }
  gotToParent() {
    this.router.navigate(['main-category', this.catergory.ParentCaterory.Handler || this.catergory.ParentCaterory.CatergoryId]);
  }
  viewItem(product: Product) {
    this.productService.updateSellProductState(product);
    this.router.navigate(['view-product', product.ProductId]);

  }

}
