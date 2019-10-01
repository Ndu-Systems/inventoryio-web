import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Brand, Caterory, User, Product } from 'src/app/_models';
import { Router } from '@angular/router';
import { AccountService, ProductService, BrandService, CateroryService } from 'src/app/_services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  heading = 'Manage Product';
  backto = '/dashboard/list-product';
  user: User;
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
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {

    this.user = this.accountService.currentUserValue;
    this.accountService.checkSession();
    this.productService.product.subscribe(state => {
      if (!state) { return false; }
      this.productId = state.ProductId;
      this.product = state;
      this.initForm();

    });
    this.brandService.getBrands(this.user.CompanyId);
    this.cateroryService.getCateries(this.user.CompanyId);

    // this.initForm();

    this.brands$ = this.brandService.brands;
    this.catergories$ = this.cateroryService.categories;
  }
  initForm() {
    this.rForm = this.fb.group({
      ProductId: [this.product.ProductId, Validators.required],
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
      CompanyId: [this.user.CompanyId, Validators.required],
      CreateUserId: [this.user.UserId, Validators.required],
      StatusId: [1, Validators.required],
      ModifyUserId: [this.user.UserId, Validators.required],
    }
    );
  }
  get getFormValues() {
    return this.rForm.controls;
  }
  update(product: Product) {
    this.productService.updateProduct(product);
    this.messageService.add({
      severity: 'success',
      summary: 'Success!',
      detail: 'Product updated! '
    });
  }

}
