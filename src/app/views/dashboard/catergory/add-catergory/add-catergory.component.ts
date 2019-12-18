import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Brand, Caterory, User, Product, Banner } from 'src/app/_models';
import { Router } from '@angular/router';
import { AccountService, ProductService, BrandService, CateroryService, BannerService } from 'src/app/_services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-catergory',
  templateUrl: './add-catergory.component.html',
  styleUrls: ['./add-catergory.component.scss']
})
export class AddCatergoryComponent implements OnInit {
  @Output() showForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  rForm: FormGroup;
  error: string;
  brands$: Observable<Brand[]>;
  catergories$: Observable<Caterory[]>;
  banner: Banner;
  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private cateroryService: CateroryService,
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
    });
    this.banner = this.bannerService.currentBannerValue;

  }

  add(caterory: Caterory) {
    this.cateroryService.addCaterory(caterory);
    this.messageService.add({
      severity: 'success',
      summary: 'Success!',
      detail: 'catergory  created '
    });
    this.routeTo.navigate([this.banner.backto]);
  }

  cancel() {
    this.routeTo.navigate([this.banner.backto]);
  }


}
