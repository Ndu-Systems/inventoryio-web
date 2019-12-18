import { Component, OnInit } from '@angular/core';
import { BrandService, AccountService, BannerService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { Brand, NotFoundModel } from 'src/app/_models';
import { Router } from '@angular/router';
import { NotFoundConstants } from '../../shared';

@Component({
  selector: 'app-list-brands',
  templateUrl: './list-brands.component.html',
  styleUrls: ['./list-brands.component.scss']
})
export class ListBrandsComponent implements OnInit {
  brands$: Observable<Brand[]>;
  showForm: boolean;
  search;
  notFoundModel: NotFoundModel;

  constructor(private brandService: BrandService,
              private accountService: AccountService,
              private router: Router,
              private bannerService: BannerService
  ) { }

  ngOnInit() {
    this.brands$ = this.brandService.brands;
    const user = this.accountService.currentUserValue;
    this.accountService.checkSession();
    this.brandService.getBrands(user.CompanyId);
    this.notFoundModel = {
      Image: NotFoundConstants.NOT_FOUND_BRANDS.image,
      Message: NotFoundConstants.NOT_FOUND_BRANDS.message
    };
  }

  add() {
    this.bannerService.updateState({
      backto: '/dashboard/list-brands',
   });
    this.router.navigate(['/dashboard/add-brand']);
  }

  showAdd() {
    this.showForm = !this.showForm;
  }

  clearSearch() { this.search = null; }

}
