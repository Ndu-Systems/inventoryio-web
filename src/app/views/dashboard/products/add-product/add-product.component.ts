import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, AccountService, RolesService } from 'src/app/_services';
import { User, Product } from 'src/app/_models';

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

  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private productService: ProductService,
  ) {
  }

  ngOnInit() {

    const user: User = this.accountService.currentUserValue;
    if (!user) {
      this.routeTo.navigate(['sign-in']);
    }
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

  }
  get getFormValues() {
    return this.rForm.controls;
  }
  add(product: Product) {
    this.productService.addProduct(product);
    this.routeTo.navigate(['/dashboard/list-product']);
  }

}
