import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Brand, Caterory, User, Service } from 'src/app/_models';
import { Router } from '@angular/router';
import {
  AccountService,
  BrandService,
  CateroryService,
  BannerService,
  UploadService,
} from 'src/app/_services';
import { MessageService } from 'primeng/api';
import { ServiceService } from 'src/app/_services/dashboard/service.service';

@Component({
  selector: 'app-add-company-service',
  templateUrl: './add-company-service.component.html',
  styleUrls: ['./add-company-service.component.scss']
})
export class AddCompanyServiceComponent implements OnInit {

  heading = 'Add services';
  backto = '/dashboard';
  rForm: FormGroup;
  error: string;
  brands$: Observable<Brand[]>;
  catergories$: Observable<Caterory[]>;
  service: Service;

  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private serviceService: ServiceService,
    private brandService: BrandService,
    private cateroryService: CateroryService,
    private bannerService: BannerService,
    private uploadService: UploadService,
    private messageService: MessageService,

  ) {
    this.bannerService.updateState({
      heading: 'Add services',
      backto: '/dashboard'
    });
  }

  ngOnInit() {

    const user: User = this.accountService.currentUserValue;
    this.accountService.checkSession();
    this.brandService.getBrands(user.CompanyId);
    this.cateroryService.getCateries(user.CompanyId);

    this.serviceService.service.subscribe(prod => {
      this.service = prod;
    });
    if (!this.service || this.service.ServiceId) {
      this.service = {
        ServiceId: '',
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
      Name: [this.service.Name || '', Validators.required],
      BrandId: [this.service.BrandId || ''],
      CatergoryId: [this.service.CatergoryId || ''],
      Description: [this.service.Description || ' '],
      UnitPrice: [this.service.UnitPrice || ''],
      UnitCost: [this.service.UnitCost || ''],
      Code: [this.service.Code || ''],
      SKU: [this.service.SKU || 'na'],
      Quantity: [this.service.Quantity || undefined],
      LowStock: [this.service.LowStock || undefined],
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
  onSubmit(service: Service) {
    service.Images = this.uploadService.currentImageValue;
    console.log(service);

    this.serviceService.addService(service);
    this.messageService.add({
      severity: 'success',
      summary: 'Success!',
      detail: 'service created '
    });
    this.routeTo.navigate([`/dashboard/list-service`]);

  }
  addbrand(data: Service) {
    this.bannerService.updateState({
      backto: '/dashboard/add-service'
    });
    this.serviceService.updateCurrentService(data);
    this.routeTo.navigate(['/dashboard/add-brand']);
  }

  addcatergory(data: Service) {
    this.bannerService.updateState({
      backto: '/dashboard/add-service'
    });
    this.serviceService.updateCurrentService(data);
    this.routeTo.navigate(['/dashboard/add-catergory']);

  }
}
