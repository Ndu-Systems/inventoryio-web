import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SearchQuery, SearchQueryGroup } from 'src/app/_models/serach.query.model';
import { Product } from 'src/app/_models';
import { ProductService } from './product.service';
import { OrdersService } from './orders.service';
import { PartnerService } from './partner.service';
import { stat } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class SearchQueryService {
  private currentSearchQuerySubject: BehaviorSubject<SearchQueryGroup[]>;
  public currentsSearchQuery: Observable<SearchQueryGroup[]>;
  constructor(
    private productService: ProductService,
    private ordersService: OrdersService,
    private partnerService: PartnerService,
  ) {
    this.currentSearchQuerySubject = new BehaviorSubject<SearchQueryGroup[]>([]);
    this.currentsSearchQuery = this.currentSearchQuerySubject.asObservable();
  }

  public get currentSearchQueryValue(): SearchQueryGroup[] {
    return this.currentSearchQuerySubject.value;
  }
  updateState(data: SearchQueryGroup[]) {
    this.currentSearchQuerySubject.next(data);
  }
  clear() {
    this.currentSearchQuerySubject.next([]);
  }

  resetSearchQueryState() {
    this.currentSearchQuerySubject.next(null);
  }

  mapProducts() {
    this.productService.products.subscribe(products => {
      if (products && products.length) {
        const searchQuery: SearchQuery[] = [];
        products.forEach(product => {
          searchQuery.push({
            Id: product.ProductId,
            Name: product.Name,
            Keyword: product.Name + ' ' + product.Description + ' ' + product.UnitPrice,
            Type: 'products',
            Item: product,
          });
        });


        const state = this.currentSearchQueryValue || [];
        state[0] = { SearchQuery: searchQuery, Type: 'products' };
        this.updateState(state);
      }
    });
  }

  mapPartners() {
    this.partnerService.partners.subscribe(partners => {
      if (partners && partners.length) {
        const searchQuery = [];
        partners.forEach(partner => {
          searchQuery.push({
            Id: partner.PartnerId,
            Name: partner.Name + ' ' + partner.Surname,
            Keyword: partner.Name + ' ' + partner.Surname + ' ' + partner.Address,
            Type: 'partners',
            Item: partner,
          });
        });

        const state = this.currentSearchQueryValue || [];
        state[1] = { SearchQuery: searchQuery, Type: 'partners' };
        this.updateState(state);
      }
    });
  }
  mapOrders() {
    this.ordersService.orders.subscribe(orders => {
      if (orders && orders.length) {
        const searchQuery = [];
        orders.forEach(order => {
          if (order.Customer) {
            searchQuery.push({
              Id: order.OrdersId,
              Name: (order.Customer && order.Customer.Name) + ' INV' + order.OrderId,
              Keyword: order.Customer && order.Customer.Name + ' invoice INV' + order.OrderId,
              Type: 'orders',
              Item: order,
            });
          }
        });
        const state = this.currentSearchQueryValue || [];
        state[3] = { SearchQuery: searchQuery, Type: 'orders' };
        this.updateState(state);
      }
    });
  }

  mapLinks() {
    const searchQuery = [];
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
    const state = this.currentSearchQueryValue || [];
    state[2] = { SearchQuery: searchQuery, Type: 'link' };
    this.updateState(state);
  }
}
