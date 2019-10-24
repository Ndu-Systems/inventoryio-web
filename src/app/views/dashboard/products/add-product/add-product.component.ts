import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, AccountService, CateroryService, BrandService, BannerService, UploadService } from 'src/app/_services';
import { User, Product, Brand, Caterory } from 'src/app/_models';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { state } from '@angular/animations';

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
  prodcut: Product;

  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private productService: ProductService,
    private brandService: BrandService,
    private cateroryService: CateroryService,
    private bannerService: BannerService,
    private uploadService: UploadService,
    private messageService: MessageService,

  ) {
    this.bannerService.updateState({
      heading: 'Add Products',
      backto: '/dashboard'
    });
  }

  ngOnInit() {

    const user: User = this.accountService.currentUserValue;
    this.accountService.checkSession();
    this.brandService.getBrands(user.CompanyId);
    this.cateroryService.getCateries(user.CompanyId);

    this.productService.product.subscribe(prod => {
      this.prodcut = prod;
    });
    if (!this.prodcut || this.prodcut.ProductId) {
      this.prodcut = {
        ProductId: '',
        BrandId: '',
        CatergoryId: '',
        CompanyId: '',
        SupplierId: '',
        Name: '',
        Description: '',
        UnitPrice: '',
        UnitCost: 0,
        Code: '',
        SKU: '',
        Quantity: 0,
        LowStock: '',
        CreateDate: '',
        CreateUserId: '',
        ModifyDate: '',
        ModifyUserId: '',
        StatusId: ''
      };
    }
    this.rForm = this.fb.group({
      Name: [this.prodcut.Name || '', Validators.required],
      BrandId: [this.prodcut.BrandId || ''],
      CatergoryId: [this.prodcut.CatergoryId || ''],
      Description: [this.prodcut.Description || ' '],
      UnitPrice: [this.prodcut.UnitPrice || ''],
      UnitCost: [this.prodcut.UnitCost || ''],
      Code: [this.prodcut.Code || ''],
      SKU: [this.prodcut.SKU || 'na'],
      Quantity: [this.prodcut.Quantity || undefined],
      LowStock: [this.prodcut.LowStock || undefined],
      CompanyId: [user.CompanyId, Validators.required],
      CreateUserId: [user.UserId, Validators.required],
      StatusId: [1, Validators.required],
      ModifyUserId: [user.UserId, Validators.required],
      image: new FormControl(null)

    }
    );


    this.brands$ = this.brandService.brands;
    this.catergories$ = this.cateroryService.categories;
    this.uploadService.clearState();

  }
  get getFormValues() {
    return this.rForm.controls;
  }
  onSubmit(product: Product) {
    product.Images = this.uploadService.currentImageValue;
    console.log(product);
    
    this.productService.addProduct(product);
    this.messageService.add({
      severity: 'success',
      summary: 'Success!',
      detail: 'product created '
    });
  //  this.routeTo.navigate([`/dashboard/product-details`]);

  }
  addbrand(data: Product) {
    this.bannerService.updateState({
      heading: 'Add Brand',
      backto: '/dashboard/add-product'
    });
    this.productService.updateCurrentProduct(data);
    this.routeTo.navigate(['/dashboard/add-brand']);

  }

  addcatergory(data: Product) {
    this.bannerService.updateState({
      heading: 'Add Catergory',
      backto: '/dashboard/add-product'
    });
    this.productService.updateCurrentProduct(data);
    this.routeTo.navigate(['/dashboard/add-catergory']);

  }
}
