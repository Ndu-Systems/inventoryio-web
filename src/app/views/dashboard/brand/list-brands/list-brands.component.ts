import { Component, OnInit } from '@angular/core';
import { BrandService, AccountService, BannerService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { Brand } from 'src/app/_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-brands',
  templateUrl: './list-brands.component.html',
  styleUrls: ['./list-brands.component.scss']
})
export class ListBrandsComponent implements OnInit {
  brands$: Observable<Brand[]>;
  constructor(private brandService: BrandService,
              private accountService: AccountService,
              private router: Router,
              private bannerService: BannerService,


  ) { }

  ngOnInit() {
    this.brands$ = this.brandService.brands;
    const user = this.accountService.currentUserValue;
    if (!user.UserId) { this.router.navigate(['sign-in']); }

    this.bannerService.updateState({
      heading: 'My brands',
      backto: '/dashboard',
    });
    this.brandService.getBrands(user.CompanyId);
  }

}
