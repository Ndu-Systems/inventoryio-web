import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoresService, AccountService } from 'src/app/_services';
import { Store, User } from 'src/app/_models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-store',
  templateUrl: './edit-store.component.html',
  styleUrls: ['./edit-store.component.scss']
})
export class EditStoreComponent implements OnInit {
  rForm: FormGroup;
  store: Store;
  user: User;
  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private messageService: MessageService,
    private accountService: AccountService,
    private storesService: StoresService
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.storesService.store.subscribe(store => {
      if (store) {
        this.store = store;
        this.initForm();
      }
    });
  }

  initForm() {
    this.rForm = this.fb.group({
      StoreId:[this.store.StoreId],
      Name: [this.store.Name, Validators.required],
      CompanyId: [this.store.CompanyId, Validators.required],
      TelephoneNumber: [this.store.TelephoneNumber, Validators.required],
      Address: [this.store.Address, Validators.required],
      Email: [null],
      CreateUserId: [this.store.CreateUserId, Validators.required],
      ModifyUserId: [this.user.UserId, Validators.required],
      StatusId: [this.store.StatusId, Validators.required]
    });
  }

  update(store: Store) {
    this.storesService.updateStore(store);
    this.messageService.add({
      severity: 'success',
      summary: 'Success!',
      detail: 'Store updated'
    });
    this.storesService.removeCurrentStore();
    this.routeTo.navigate(['/dashboard/stores']);
  }

}
