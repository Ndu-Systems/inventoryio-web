import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Brand, Caterory, User, Product } from 'src/app/_models';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, ProductService, BrandService, CateroryService } from 'src/app/_services';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  heading = 'Manage Product';
  backto = '/dashboard/list-product';
  rForm: FormGroup;
  error: string;
  brands$: Observable<Brand[]>;
  catergories$: Observable<Caterory[]>;
  product: Product;
  productId: string;
  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private productService: ProductService,
    private brandService: BrandService,
    private cateroryService: CateroryService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.productId = r.id;
    });
    this.product = this.productService.allProductsValue.find(x => x.ProductId === this.productId);
  }

  ngOnInit() {

    const user: User = this.accountService.currentUserValue;
    if (!user) {
      this.routeTo.navigate(['sign-in']);
    }
    this.brandService.getBrands(user.CompanyId);
    this.cateroryService.getCateries(user.CompanyId);
    this.rForm = this.fb.group({
      Name: [this.product.Name, Validators.required],
      BrandId: [this.product.BrandId],
      CatergoryId: [this.product.CatergoryId],
      Description: [this.product.Description],
      UnitPrice: [this.product.UnitPrice],
      UnitCost: [this.product.UnitCost],
      Code: [this.product.Code],
      SKU: [this.product.SKU],
      Quantity: [this.product.Quantity],
      LowStock: [this.product.LowStock],
      CompanyId: [user.CompanyId, Validators.required],
      CreateUserId: [user.UserId, Validators.required],
      StatusId: [1, Validators.required],
      ModifyUserId: [user.UserId, Validators.required],
    }
    );


    this.brands$ = this.brandService.currentsBrand;
    this.catergories$ = this.cateroryService.currentCaterory;
  }
  get getFormValues() {
    return this.rForm.controls;
  }
  add(product: Product) {
    this.productService.addProduct(product);
    this.routeTo.navigate(['/dashboard/list-product']);
  }

}
