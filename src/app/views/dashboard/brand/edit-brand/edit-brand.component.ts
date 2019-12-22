import { Component, OnInit } from '@angular/core';
import { BrandService, AccountService, BannerService } from 'src/app/_services';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Brand, User } from 'src/app/_models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-brand',
  templateUrl: './edit-brand.component.html',
  styleUrls: ['./edit-brand.component.scss']
})
export class EditBrandComponent implements OnInit {
  rForm: FormGroup;
  brand: Brand;
  user: User;
  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private accountService: AccountService,
    private messageService: MessageService,
    private routeTo: Router
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.brandService.brand.subscribe(brand => {
      if (brand) {
        this.brand = brand;
        this.initForm();
      }
    });
  }

  initForm() {
    this.rForm = this.fb.group({
      BrandId: [this.brand.BrandId],
      Name: [this.brand.Name, Validators.required],
      CompanyId: [this.brand.CompanyId, Validators.required],
      CreateUserId: [this.brand.CreateUserId, Validators.required],
      ModifyUserId: [this.user.UserId, Validators.required],
      StatusId: [this.brand.StatusId, Validators.required]
    });
  }

  update(brand: Brand) {
    this.brandService.updateBrand(brand);
    this.messageService.add({
      severity: 'success',
      summary: 'Success!',
      detail: 'Brand updated'
    });
    this.brandService.removeCurrentBrand();
    this.routeTo.navigate(['/dashboard/list-brands']);
  }

}
