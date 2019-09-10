import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Brand, Caterory, User } from 'src/app/_models';
import { Router } from '@angular/router';
import { AccountService, ProductService, BrandService, CateroryService } from 'src/app/_services';

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

  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private brandService: BrandService,
  ) {

  }

  ngOnInit() {

    const user: User = this.accountService.currentUserValue;
    if (!user) {
      this.routeTo.navigate(['sign-in']);
    }
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
    this.routeTo.navigate(['/dashboard/add-product']);
  }

}
