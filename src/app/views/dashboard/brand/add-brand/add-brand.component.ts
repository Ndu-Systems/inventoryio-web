import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Brand, Caterory, User } from 'src/app/_models';
import { Router } from '@angular/router';
import { AccountService, ProductService, BrandService, CateroryService, BannerService } from 'src/app/_services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss']
})
export class AddBrandComponent implements OnInit {

  heading = 'Add brand';
  backto = '/dashboard/add-product';
  rForm: FormGroup;
  error: string;
  brands$: Observable<Brand[]>;
  catergories$: Observable<Caterory[]>;

  mxolist: any[] = [
    {
      name: 'Mxolisi', age: 1
    },
    {
      name: 'Mxolisi', age: 2
    },
    {
      name: 'Mxolisi', age: 3
    },
    {
      name: 'Mxolisi', age: 4
    }
  ];

  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private brandService: BrandService,
    private messageService: MessageService,
    private bannerService: BannerService,
  ) {

  }

  ngOnInit() {

    const user: User = this.accountService.currentUserValue;
    this.accountService.checkSession();

    this.rForm = this.fb.group({
      Name: ['', Validators.required],
      CompanyId: [user.CompanyId, Validators.required],
      CreateUserId: [user.UserId, Validators.required],
      StatusId: [1, Validators.required],
      ModifyUserId: [user.UserId, Validators.required],
    }
    );
  }

  add(brand: Brand) {
    this.brandService.addBrand(brand);
    this.messageService.add({
      severity: 'success',
      summary: 'Success!',
      detail: 'brand  created '
    });
    this.routeTo.navigate([this.bannerService.currentBannerValue.backto]);
  }

}
