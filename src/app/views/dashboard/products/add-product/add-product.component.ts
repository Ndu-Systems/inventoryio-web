import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, AccountService, RolesService, CateroryService, BrandService, BannerService, UploadService } from 'src/app/_services';
import { User, Product, Brand, Caterory } from 'src/app/_models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  heading = 'Add Products';
  backto = '/dashboard';
  rForm: FormGroup;
  error: string;
  brands$: Observable<Brand[]>;
  catergories$: Observable<Caterory[]>;

  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private productService: ProductService,
    private brandService: BrandService,
    private cateroryService: CateroryService,
    private bannerService: BannerService,
    private uploadService: UploadService
  ) {
    this.bannerService.updateState({
      heading: 'Add Products',
      backto: '/dashboard'
    });
  }

  ngOnInit() {

    const user: User = this.accountService.currentUserValue;
    if (!user) {
      this.routeTo.navigate(['sign-in']);
    }
    this.brandService.getBrands(user.CompanyId);
    this.cateroryService.getCateries(user.CompanyId);
    this.rForm = this.fb.group({
      Name: ['', Validators.required],
      BrandId: [''],
      CatergoryId: [''],
      Description: [''],
      UnitPrice: [''],
      UnitCost: [''],
      Code: [''],
      SKU: [''],
      Quantity: [''],
      LowStock: [''],
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
  onSubmit(product: Product) {
    this.productService.addProduct(product);
    this.routeTo.navigate([`/dashboard/product-details`]);
    this.uploadService.apendState(null);

  }
  addbrand() {
    this.bannerService.updateState({
      heading: 'Add Brand',
      backto: '/dashboard/add-product'
    });
    this.routeTo.navigate(['/dashboard/add-brand']);

  }

  addcatergory() {
    this.bannerService.updateState({
      heading: 'Add Catergory',
      backto: '/dashboard/add-product'
    });
    this.routeTo.navigate(['/dashboard/add-catergory']);

  }
}
