import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SearchQuery } from 'src/app/_models/serach.query.model';
import { Product } from 'src/app/_models';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class SearchQueryService {
  private currentSearchQuerySubject: BehaviorSubject<SearchQuery[]>;
  public currentsSearchQuery: Observable<SearchQuery[]>;
  constructor(
    private productService: ProductService
  ) {
    this.currentSearchQuerySubject = new BehaviorSubject<SearchQuery[]>([]);
    this.currentsSearchQuery = this.currentSearchQuerySubject.asObservable();
  }

  public get currentSearchQueryValue(): SearchQuery[] {
    return this.currentSearchQuerySubject.value;
  }
  updateState(data: SearchQuery[]) {
    this.currentSearchQuerySubject.next(data);
  }

  resetSearchQueryState() {
    this.currentSearchQuerySubject.next(null);
  }

  mapProducts() {
    this.productService.products.subscribe(products => {
      if (products && products.length) {
        const searchQuery = this.currentSearchQueryValue || [];
        products.forEach(product => {
          searchQuery.push({
            Id: product.ProductId,
            Name: product.Name + ' R' + product.UnitPrice,
            Keyword: product.Name + ' ' + product.Description + ' ' + product.UnitPrice,
            Type: 'products',
            Item: product,
          });
        });
        this.updateState(searchQuery);
      }
    });
  }

  mapLinks() {
    const searchQuery = this.currentSearchQueryValue || [];
    searchQuery.push(
      {
        Id: 'addproduct',
        Name: 'Add product',
        Keyword: 'new product, how to add a new product',
        Type: 'link',
        Item: 'dashboard/add-product'
      },
      {
        Id: 'sell',
        Name: 'Create a sale',
        Keyword: 'Create a sale, new sale, new sale order',
        Type: 'link',
        Item: 'dashboard/sell'
      },
      {
        Id: 'sell',
        Name: 'Manage sales invoices',
        Keyword: 'Orders, print, email, cancel order, payments',
        Type: 'link',
        Item: 'dashboard/list-orders'
      },
      {
        Id: 'banking-details',
        Name: 'Banking details settings',
        Keyword: 'payments, bank details invoice banking settings',
        Type: 'link',
        Item: 'dashboard/company-view-configs/bank-details'
      },
      {
        Id: 'banking-details',
        Name: 'Banking details settings',
        Keyword: 'my address, company address, invoice address',
        Type: 'link',
        Item: 'dashboard/company-view-configs/address-details settings'
      },
      {
        Id: 'banking-details',
        Name: 'Invoice color and logo settings',
        Keyword: 'invoice colour logo and colors settings',
        Type: 'link',
        Item: 'dashboard/company-view-configs/logo-and-colors'
      },
      {
        Id: 'banking-details',
        Name: 'Shop settings',
        Keyword: 'shop colours  settings',
        Type: 'link',
        Item: 'dashboard/company-view-configs/shop'
      },
    );
    this.updateState(searchQuery);
  }
}
