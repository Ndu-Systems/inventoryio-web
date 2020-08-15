import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ProductService, AccountService, CateroryService,
  BrandService, BannerService, UploadService, ScannerService, DocumentsService
} from 'src/app/_services';
import { User, Product, Brand, Caterory, Image } from 'src/app/_models';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { state } from '@angular/animations';
import { AttributeService } from 'src/app/_services/dashboard/attribute.service';
import { Attribute } from 'src/app/_models/Attribute.model';
import { TopHeading } from 'src/app/_models/top-heading.model';
import { environment } from 'src/environments/environment';
import { ProductAvailabilityModel, ProductAvailabilityTypes } from 'src/app/_models/product.availability.model';
import { Productoptions } from 'src/app/_models/productoptions.model';

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
  products: Product[] = [];
  parentCategories: Caterory[] = [];
  childrenCategories: Caterory[] = [];
  sizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38'];
  productAvailabilityTypes: ProductAvailabilityModel[] = ProductAvailabilityTypes;
  topHeading: TopHeading = {
    backto: '/dashboard/list-product',
    heading: 'Create product'
  };
  catergories: Caterory[] = [];
  catergoryName: string;
  user: User;
  catergoryType: string;
  showModal: boolean;
  modalHeading: string;
  parent: Caterory;
  current: Caterory;
  selectedAvailability: ProductAvailabilityModel;
  allSizes: Productoptions[] = [];
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
    private documentsService: DocumentsService,


  ) {
    this.bannerService.updateState({
      heading: 'Add Products',
      backto: '/list-product'
    });
  }
  // ngOnDestroy(): void {
  //   this.productService.updateCurrentProduct(null);
  // }

  ngOnInit() {

    this.user = this.accountService.currentUserValue;
    this.accountService.checkSession();
    this.brandService.getBrands(this.user.CompanyId);
    this.cateroryService.getCateries(this.user.CompanyId);
    this.catergories$ = this.cateroryService.categories;
    this.cateroryService.categories.subscribe(data => {
      if (data && data.length) {
        this.catergories = data;
        this.parentCategories = data.filter(x => x.CatergoryType === 'parent');
        this.childrenCategories = data.filter(x => x.CatergoryType === 'child');
      } else {
        this.parentCategories = [{ Name: 'Ladies' }, { Name: 'Men' }, { Name: 'Unisex' }];
        this.childrenCategories = [{ Name: 'New In' }];
      }
      this.parentCategories.map(x => x.Class = ['head-item']);
      this.childrenCategories.map(x => x.Class = ['catergory']);
      this.loadProduct();
    });

    this.productService.products.subscribe(data => {
      if (data) {
        this.products = data;
      }
      else {
        this.products = [];
      }
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


    this.uploadService.images.subscribe(images => {
      this.images = images;
    });

    this.selectedAvailability = this.productAvailabilityTypes[0];

    this.mapSizes();
  }

  loadProduct() {
    this.productService.product.subscribe(prod => {
      if (prod) {
        this.product = prod;
        this.topHeading.heading = this.product.ProductId.length > 5 ? 'Update product.' : 'Create product';
        this.code = 'P' + this.product.Code;
        this.heading = this.product.ProductId.length > 5 ? 'Update product.' : 'Add product';
        if (!this.product.Productoptions) {
          this.product.Productoptions = [];
        }
        if (this.product.ProductId.length < 5) {
          this.selectParent(this.parent || this.parentCategories[0]);
          this.selectChild(this.childrenCategories[0]);
        }

        if (this.product.Catergory) {
          const parent = this.parentCategories.find(x => x.CatergoryId === this.product.Catergory.Parent);
          const child = this.childrenCategories.find(x => x.CatergoryId === this.product.CatergoryId);
          this.childrenCategories = this.childrenCategories.filter(x => x.Parent === parent.CatergoryId);
          if (parent && child) {
            parent.Class = ['head-item', 'active'];
            child.Class = ['catergory', 'active'];
          }

        }
        if (this.product.ProductAvailability) {
          const availability = this.productAvailabilityTypes.find(x => x.Code === this.product.ProductAvailability);
          this.selectAvailabilityParent(availability);
        } else {
          this.selectAvailabilityParent(this.productAvailabilityTypes[0]);
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
          PreparingDays: 3,
          Quantity: 1,
          LowStock: 0,
          CreateDate: '',
          CreateUserId: '',
          ModifyDate: '',
          ModifyUserId: '',
          StatusId: 1,
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
      const sizes = this.allSizes.filter(x => x.ngClass.length > 1);
      this.product.Productoptions = this.product.Productoptions.concat(sizes);
      this.product.Quantity = quantity || 0;
      this.product.ProductAvailability = this.selectedAvailability.Code;
      if (this.product.ProductId.length > 5) {
        this.product.TrackInventory = true;
        this.productService.updateProduct(this.product);
      } else {
        this.product.CompanyId = this.accountService.currentUserValue.CompanyId;
        this.productService.addProduct(this.product);
      }
      this.back();
    }

  }
  validateForm() {
    this.nameError = undefined;
    this.priceError = undefined;
    if (!this.product.Name) {
      this.nameError = 'Name is required!';
    }
    if (!this.product.UnitPrice) {
      this.priceError = 'Price is required!';
    }
    return !this.nameError && !this.priceError;
  }
  selectParent(caterory: Caterory) {
    if (caterory && caterory.CatergoryId) {
      this.parentCategories.map(x => x.Class = ['head-item']);
      caterory.Class = ['head-item', 'active'];
      this.childrenCategories = caterory.Children;
      this.parent = caterory;
    }
  }
  selectChild(caterory: Caterory) {
    if (caterory && caterory.CatergoryId) {
      this.childrenCategories.map(x => x.Class = ['catergory']);
      caterory.Class = ['catergory', 'active'];
      this.product.CatergoryId = caterory.CatergoryId;
      this.product.Catergory = caterory;
    }
  }
  closeModal() {
    this.showModal = false;
  }
  addNewCatergory(type: string) {
    this.catergoryType = type;
    this.showModal = true;
    this.modalHeading = `Add ${type} catergory.`;
    this.current = {
      Name: '',
      ImageUrl: '',
      Description: '',
      Parent: this.parent && this.parent.CatergoryId || '',
      CatergoryType: this.catergoryType,
      CompanyId: this.user.CompanyId,
      CreateUserId: this.user.UserId,
      StatusId: 1,
      ModifyUserId: this.user.UserId
    };
  }

  saveNewCatergory() {
    if (this.catergoryType !== 'child') {
      this.parent = undefined;
    }

    this.cateroryService.addCaterorySync(this.current).subscribe(data => {
      this.childrenCategories.push(data);
      this.childrenCategories[this.childrenCategories.length - 1].Class = ['catergory', 'just-added'];
    });
    this.showModal = false;
    this.catergoryType = undefined;
    this.catergoryName = undefined;
  }
  editCatergory(caterory: Caterory) {
    this.showModal = true;
    this.modalHeading = `Add ${caterory.CatergoryType} catergory.`;
    this.current = caterory;
  }
  imageChanged(event) {
    const files = event.target.files;
    console.log(files);
    this.uplaodFile(files);

  }


  uplaodFile(files: FileList) {
    if (!files.length) {
      return false;
    }

    Array.from(files).forEach(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', `tybo.${file.name.split('.')[file.name.split('.').length - 1]}`); // file extention
      this.documentsService.uploadFile(formData).subscribe(url => {
        this.current.ImageUrl = `${environment.API_URL}/api/upload/${url}`;
      });

    });

  }

  selectProductAvailability(value: string) {
    this.product.ProductAvailability = value;
    this.productService.updateCurrentProduct(this.product);
  }

  selectAvailabilityParent(item: ProductAvailabilityModel) {
    if (item && item.Code) {
      this.productAvailabilityTypes.map(x => x.Class = ['head-item']);
      item.Class = ['head-item', 'active'];
      this.selectedAvailability = item;
    }
  }

  mapSizes() {
    this.allSizes = [];
    this.sizes.forEach(size => {
      this.allSizes.push({
        Id: '',
        ProductId: '',
        CompanyId: '',
        Name1: 'Size',
        Name2: '',
        Name3: '',
        Name4: '',
        Name5: '',
        Value1: size,
        Value2: '',
        Value3: '',
        Value4: '',
        Value5: '',
        ImageUrl1: '',
        ImageUrl2: '',
        ImageUrl3: '',
        Quantity: 0,
        CreateUserId: '',
        ModifyUserId: '',
        StatusId: 1,
        ngClass: ['size']

      });
    });
  }
  selectSize(po: Productoptions) {
    if (po.ngClass.find(x => x === 'active')) {
      po.ngClass = ['size'];
      return true;
    }
    po.ngClass = ['size', 'active'];
  }
}
