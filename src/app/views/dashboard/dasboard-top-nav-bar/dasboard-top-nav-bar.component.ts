import { Component, OnInit } from '@angular/core';
import { AccountService, ProductService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models';
import { Router } from '@angular/router';
import { SearchQuery } from 'src/app/_models/serach.query.model';
import { SearchQueryService } from 'src/app/_services/dashboard/search-query.service';

@Component({
  selector: 'app-dasboard-top-nav-bar',
  templateUrl: './dasboard-top-nav-bar.component.html',
  styleUrls: ['./dasboard-top-nav-bar.component.scss']
})
export class DasboardTopNavBarComponent implements OnInit {
  user$: Observable<User> = this.accountService.user;
  searchQueryResults = [];
  searchableItems: SearchQuery[] = [];
  searchQuery = '';

  constructor(
    private accountService: AccountService,
    private routeTo: Router,
    private searchQueryService: SearchQueryService,
    private productService: ProductService,
  ) { }

  ngOnInit() {
    this.searchQueryService.mapProducts();
    this.searchQueryService.mapLinks();
    this.searchQueryService.currentsSearchQuery.subscribe(items => {
      this.searchableItems = items;
    });
  }
  toProfile() {
    this.routeTo.navigate(['dashboard/profile']);

  }
  selectResults(item: SearchQuery) {
    if (item.Type === 'products') {
      this.productService.updateCurrentProduct(item.Item);
      this.routeTo.navigate(['dashboard/product-details']);
    }
    if (item.Type === 'link') {
      this.routeTo.navigate([item.Item]);
    }
    this.searchQuery = '';
  }
  doTheSearchResults(key) {
    if (key) {
      this.searchQueryResults = this.searchableItems.filter(
        x => x.Keyword.toLocaleLowerCase().includes(key.toLocaleLowerCase())
      );
    }
  }
}
