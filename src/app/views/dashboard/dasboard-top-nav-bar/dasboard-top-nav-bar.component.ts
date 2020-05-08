import { Component, OnInit } from '@angular/core';
import { AccountService, ProductService, OrdersService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models';
import { Router } from '@angular/router';
import { SearchQuery, SearchQueryGroup } from 'src/app/_models/serach.query.model';
import { SearchQueryService } from 'src/app/_services/dashboard/search-query.service';

@Component({
  selector: 'app-dasboard-top-nav-bar',
  templateUrl: './dasboard-top-nav-bar.component.html',
  styleUrls: ['./dasboard-top-nav-bar.component.scss']
})
export class DasboardTopNavBarComponent implements OnInit {
  user$: Observable<User> = this.accountService.user;
  searchQueryResults = [];
  searchableItems: SearchQueryGroup[] = [];
  searchQuery = '';
  constructor(
    private accountService: AccountService,
    private routeTo: Router,
    private searchQueryService: SearchQueryService,
    private productService: ProductService,
    private ordersService: OrdersService,
  ) { }

  ngOnInit() {
    this.searchQueryService.mapProducts();
    this.searchQueryService.mapLinks();
    this.searchQueryService.mapOrders();
    this.searchQueryService.mapPartners();
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
    if (item.Type === 'partners') {
      this.routeTo.navigate(['dashboard/edit-partner', item.Id]);
    }
    if (item.Type === 'orders') {
      this.ordersService.updateOrderState(item.Item);
      this.routeTo.navigate(['dashboard/list-orders']);
    }
    if (item.Type === 'link') {
      this.routeTo.navigate([item.Item]);
    }
    this.searchQuery = '';
  }
  doTheSearchResults(key) {
    const allResults = [];
    this.searchableItems.map(x => x.SearchQuery).forEach(item => {
      const results = item.filter(s => s.Keyword.toLocaleLowerCase().includes(key.toLocaleLowerCase()));
      allResults.push(results);
    });
    this.searchQueryResults[0] = { Type: 'products', SearchQuery: allResults[0] };
    this.searchQueryResults[1] = { Type: 'partners', SearchQuery: allResults[1] };
    this.searchQueryResults[2] = { Type: 'link', SearchQuery: allResults[2] };
    this.searchQueryResults[3] = { Type: 'orders', SearchQuery: allResults[3] };
  }


}
