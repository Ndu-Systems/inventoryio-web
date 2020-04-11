import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Brand, Caterory, Product, User, Orders } from 'src/app/_models';
import { Router } from '@angular/router';
import { AccountService, ProductService, BrandService, CateroryService, BannerService, UploadService, ScannerService, OrdersService } from 'src/app/_services';
import { AttributeService } from 'src/app/_services/dashboard/attribute.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss']
})
export class CreditNoteComponent implements OnInit {

  heading = 'Add Products';
  backto = '/dashboard';
  rForm: FormGroup;
  error: string;
  brands$: Observable<Brand[]>;
  catergories$: Observable<Caterory[]>;
  prodcut: Product;
  showScan: boolean;
  isTrackInventory: boolean;
  id = 'new';

  order$: Observable<Orders>;
  order: Orders;


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
    private ordersService: OrdersService,



  ) {
    this.bannerService.updateState({
      heading: 'Add Products',
      backto: '/dashboard'
    });
  }

  ngOnInit() {

    const user: User = this.accountService.currentUserValue;
    this.accountService.checkSession();
    this.order$ = this.ordersService.order;
    this.order$.subscribe(order => {
      this.order = order;
    });



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
        TrackInventory: true,
        Quantity: 1,
        LowStock: 0,
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
      UnitCost: [this.prodcut.UnitCost || 0],
      Code: [this.prodcut.Code || ''],
      SKU: [this.prodcut.SKU || ''],
      Quantity: [this.prodcut.Quantity || 1],
      TrackInventory: [this.prodcut.TrackInventory || true],
      LowStock: [this.prodcut.LowStock || 0],
      CompanyId: [user.CompanyId, Validators.required],
      CreateUserId: [user.UserId, Validators.required],
      StatusId: [1, Validators.required],
      ModifyUserId: [user.UserId, Validators.required],
      image: new FormControl(null)
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
    this.uploadService.clearState();

    this.attributeService.attributes.subscribe(data => {
      if (data) {
        // this.attributes = data;
      }
    });

  }

  get getFormValues() {
    return this.rForm.controls;
  }

  onSubmit(product: Product) {
    product.images = this.uploadService.currentImageValue;
    // product.Attributes = this.attributes;
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
      backto: '/dashboard/add-product'
    });
    this.productService.updateCurrentProduct(data);
    this.routeTo.navigate(['/dashboard/add-brand']);
  }

  addCatergory(data: Product) {
    this.bannerService.updateState({
      backto: '/dashboard/add-product'
    });
    this.productService.updateCurrentProduct(data);
    this.routeTo.navigate(['/dashboard/add-catergory']);
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
}
