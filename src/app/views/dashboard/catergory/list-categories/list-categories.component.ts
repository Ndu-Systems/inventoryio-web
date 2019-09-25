import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand, Caterory } from 'src/app/_models';
import { AccountService, BannerService, CateroryService } from 'src/app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.css']
})
export class ListCategoriesComponent implements OnInit {

  categories$: Observable<Caterory[]>;
  constructor(private categorieservice: CateroryService,
              private accountService: AccountService,
              private router: Router,
              private bannerService: BannerService,


  ) { }

  ngOnInit() {
    this.categories$ = this.categorieservice.categories;
    const user = this.accountService.currentUserValue;
    if (!user.UserId) { this.router.navigate(['sign-in']); }

    this.bannerService.updateState({
      heading: 'My categories',
      backto: '/dashboard',
    });
    this.categorieservice.getCateries(user.CompanyId);
  }
}
