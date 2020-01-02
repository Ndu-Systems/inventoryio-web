import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand, Caterory, NotFoundModel } from 'src/app/_models';
import { AccountService, BannerService, CateroryService } from 'src/app/_services';
import { Router } from '@angular/router';
import { NotFoundConstants } from '../../shared';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.scss']
})
export class ListCategoriesComponent implements OnInit {
  search;
  categories$: Observable<Caterory[]>;
  showForm: boolean;
  notFoundModel: NotFoundModel;

  constructor(private categorieservice: CateroryService,
    private accountService: AccountService,
    private router: Router,
    private bannerService: BannerService
  ) { }

  ngOnInit() {
    this.categories$ = this.categorieservice.categories;
    const user = this.accountService.currentUserValue;
    this.accountService.checkSession();

    this.categorieservice.getCateries(user.CompanyId);
    this.notFoundModel = {
      Image: NotFoundConstants.NOT_FOUND_CATEGORIES.image,
      Message: NotFoundConstants.NOT_FOUND_CATEGORIES.message
    };
  }
  add() {
    this.bannerService.updateState({
      backto: '/dashboard/list-categories',
    });
    this.router.navigate(['/dashboard/add-catergory']);
  }
  showAdd() {
    this.showForm = !this.showForm;
  }
  updateCategory(category: Caterory) {
    this.categorieservice.updateCurrentCategory(category);
    this.router.navigate(['/dashboard/edit-category']);
  }
}
