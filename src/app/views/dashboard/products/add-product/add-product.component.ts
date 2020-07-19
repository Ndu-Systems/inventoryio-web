import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ProductService, AccountService, CateroryService,
  BrandService, BannerService, UploadService, ScannerService
} from 'src/app/_services';
import { User, Product, Brand, Caterory, Image } from 'src/app/_models';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { state } from '@angular/animations';
import { AttributeService } from 'src/app/_services/dashboard/attribute.service';
import { Attribute } from 'src/app/_models/Attribute.model';

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
  product: Product;
  showScan: boolean;
  isTrackInventory: boolean;
  attributes: Attribute[];
  images: Image[];
  nameError: string;
  priceError: string;
  code: string;
  products: Product[];

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
    private scannerService: ScannerService,
    private attributeService: AttributeService,


  ) {
    this.bannerService.updateState({
      heading: 'Add Products',
      backto: '/dashboard'
    });
  }
  // ngOnDestroy(): void {
  //   this.productService.updateCurrentProduct(null);
  // }

  ngOnInit() {

    const user: User = this.accountService.currentUserValue;
    this.accountService.checkSession();
    this.brandService.getBrands(user.CompanyId);
    this.cateroryService.getCateries(user.CompanyId);



    this.productService.products.subscribe(data => {
      if (data) {
        this.products = data;
      }
      else {
        this.products = [];
      }
      this.loadProduct();
    });

    this.scannerService.scann.subscribe(scan => {
      if (scan && window.location.href.includes('add-product')) {
        this.showScan = scan.isOpen;
        if (scan.code) {
          this.rForm.controls.Code.setValue(scan.code);
        }
      }
    });


    this.brands$ = this.brandService.brands;
    this.catergories$ = this.cateroryService.categories;

    this.attributeService.attributes.subscribe(data => {
      if (data) {
        this.attributes = data;
      }
    });

    this.uploadService.images.subscribe(images => {
      this.images = images;
    });




  }

  loadProduct() {
    this.productService.product.subscribe(prod => {
      if (prod) {
        this.product = prod;
        this.code = 'P' + this.product.Code;
        this.heading = this.product.ProductId.length > 5 ? 'Update product.' : 'Add product';
        if (!this.product.Productoptions) {
          this.product.Productoptions = [];
        }
      } else {
        this.product = {
          ProductId: '',
          BrandId: '',
          CatergoryId: '',
          CompanyId: '',
          SupplierId: '',
          Name: '',
          Description: '',
          UnitPrice: '',
          UnitCost: 0,
          Code: this.getNewCode(),
          SKU: '',
          TrackInventory: true,
          Quantity: 1,
          LowStock: 0,
          CreateDate: '',
          CreateUserId: '',
          ModifyDate: '',
          ModifyUserId: '',
          StatusId: '',
          Productoptions: []
        };
        this.productService.updateCurrentProduct(this.product);
      }
    });
  }
  getNewCode(): number {
    let maxCode = 0;
    if (this.products.length > 0) {
      maxCode = Math.max(...this.products.map(x => Number(x.Code)));
    }

    this.code = `P${maxCode + 1}`;
    return maxCode + 1;
  }

  get getFormValues() {
    return this.rForm.controls;
  }

  onSubmit(product: Product) {
    product.Images = this.images || [];
    product.Attributes = this.attributes;
    this.productService.addProduct(product);
    this.messageService.add({
      severity: 'success',
      summary: 'Success!',
      detail: 'product created '
    });

    this.routeTo.navigate([`/dashboard/list-product`]);

  }

  addBrand(data: Product) {
    this.bannerService.updateState({
      backto: '/dashboard/product'
    });
    this.productService.updateCurrentProduct(data);
    this.routeTo.navigate(['/dashboard/add-brand']);
  }

  addCatergory(data: Product) {
    this.bannerService.updateState({
      backto: '/dashboard/product'
    });
    this.productService.updateCurrentProduct(data);
    this.routeTo.navigate(['/dashboard/catergory']);
  }
  scan() {
    this.showScan = true;
  }
  handleChange(e) {
    this.isTrackInventory = e.checked;
  }

  back() {
    this.routeTo.navigate([`/dashboard/list-product`]);
  }
  saveState() {
    this.productService.updateCurrentProduct(this.product);
  }

  save() {
    if (this.validateForm()) {
      let quantity = 0;
      this.product.Productoptions.filter(x => Number(x.StatusId) === 1).forEach(x => {
        quantity += Number(x.Quantity);
      });
      this.product.Quantity = quantity;
      if (this.product.ProductId.length > 5) {
        this.product.TrackInventory = true;
        this.productService.updateProduct(this.product);
      } else {
        this.product.CompanyId = this.accountService.currentUserValue.CompanyId;
        this.productService.addProduct(this.product);
      }

    }
    this.back();
  }
  validateForm() {
    this.nameError = undefined;
    this.priceError = undefined;
    if (!this.product.Name) {
      this.nameError = 'Name is required!';
      return false;
    }
    if (!this.product.UnitPrice) {
      this.priceError = 'Price is required!';
      return false;
    }
    return true;
  }
}
