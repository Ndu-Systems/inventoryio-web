import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BannerService, StoresService, AccountService } from 'src/app/_services';
import { Router } from '@angular/router';
import { User, Store } from 'src/app/_models';

@Component({
  selector: 'app-add-store',
  templateUrl: './add-store.component.html',
  styleUrls: ['./add-store.component.scss']
})
export class AddStoreComponent implements OnInit {
  rForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private bannerService: BannerService,
    private storesService: StoresService,
    private accountService: AccountService,
    private routeTo: Router
  ) { }

  ngOnInit() {
    const user: User = this.accountService.currentUserValue;
    if (!user) {
      this.accountService.logout();
      this.routeTo.navigate(['sign-in']);
    }
    this.rForm = this.fb.group({
      Name: [null, Validators.required],
      CompanyId: [user.CompanyId, Validators.required],
      TelephoneNumber: [null, Validators.required],
      Address: ['not set'],
      CreateUserId: [user.UserId, Validators.required],
      ModifyUserId: [user.UserId, Validators.required],
      StatusId: [1, Validators.required]
    });
    this.bannerService.updateState({
      heading: 'Add a store',
      backto: '/dashboard/stores'
    });
  }

  onSubmit(store: Store) {
    this.storesService.addStore(store);
    this.routeTo.navigate(['dashboard/stores']);
  }

}