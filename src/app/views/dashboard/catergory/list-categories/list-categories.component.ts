import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand, Caterory, NotFoundModel } from 'src/app/_models';
import { AccountService, BannerService, CateroryService } from 'src/app/_services';
import { Router } from '@angular/router';
import { NotFoundConstants } from '../../shared';
import { ConfirmationService } from 'primeng/api';

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
  filteredCategories: Caterory[] = [];
  categories: Caterory[];
  heading: string;
  addLabel: string;
  childPage: boolean;
  constructor(
    private categorieservice: CateroryService,
    private accountService: AccountService,
    private router: Router,
    private bannerService: BannerService,
    private confirmationService: ConfirmationService,

  ) { }

  ngOnInit() {
    this.categories$ = this.categorieservice.categories;
    const user = this.accountService.currentUserValue;
    this.accountService.checkSession();

    this.categorieservice.updateCateroryAddTypeState({
      nextParentId: '',
      nextParentName: '',
      nextType: 'parent'
    });

    this.categorieservice.getCateries(user.CompanyId);
    this.notFoundModel = {
      Image: NotFoundConstants.NOT_FOUND_CATEGORIES.image,
      Message: NotFoundConstants.NOT_FOUND_CATEGORIES.message
    };
    this.categorieservice.categories.subscribe(data => {
      if (data && data.length) {
        this.categories = data;
        this.filteredCategories = data.filter(x => x.CatergoryType === 'parent');
        this.filteredCategories.map(x => x.ShowMenu = false);
        this.heading = `Parent categories(${this.filteredCategories.length})`;
        this.addLabel = ' Add parent category';
      }
    });
  }
  add() {
    this.bannerService.updateState({
      backto: '/dashboard/list-categories',
    });
    this.router.navigate(['/dashboard/catergory']);
  }
  showAdd() {
    this.showForm = !this.showForm;
  }
  updateCategory(category: Caterory) {
    this.categorieservice.updateCurrentCategory(category);
    this.router.navigate(['/dashboard/catergory']);
  }
  deleteCategory(category: Caterory) {
    this.confirmationService.confirm({
      message: `This category will be deleted permanently, continue?`,
      accept: () => {
        category.StatusId = -1;
        this.categorieservice.updateCategory(category);
      }
    });
  }
  clearSearch() { }
  showMenu(caterory: Caterory) {
    this.filteredCategories.map(x => x.ShowMenu = false);
    caterory.ShowMenu = true;
  }
  hideMenu() {
    this.filteredCategories.map(x => x.ShowMenu = false);
  }
  viewChildren(caterory: Caterory) {
    this.filteredCategories = this.categories.filter(x => x.Parent === caterory.CatergoryId);
    this.heading = `${caterory.Name} categories (${this.filteredCategories.length})`;
    this.addLabel = `Add ${caterory.Name} category`;
    this.childPage = true;
    this.categorieservice.updateCateroryAddTypeState(
      {
        nextParentId: caterory.CatergoryId,
        nextParentName: caterory.Name,
        nextType: 'child'
      }
    );

  }
  parents() {
    this.filteredCategories = this.categories.filter(x => x.CatergoryType === 'parent');
    this.filteredCategories.map(x => x.ShowMenu = false);
    this.childPage = false;
    this.heading = `Parent categories(${this.filteredCategories.length})`;
    this.addLabel = ' Add parent category';
    this.categorieservice.updateCateroryAddTypeState(
      {
        nextParentId: '',
        nextParentName: '',
        nextType: 'parent'
      }
    );
  }
}
