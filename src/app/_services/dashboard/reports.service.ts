import { Injectable } from '@angular/core';
import { Orders, OrderProducts, TopSellingProduct, Product } from 'src/app/_models';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor() { }
  getOrdersForARange(dateFrom: string, dateTo: string, orders: Orders[]): Orders[] {
    if (dateFrom === dateTo) {
      return orders.filter(x => this.getDateTimeOnly(x.CreateDate) === this.getDateTimeOnly(dateFrom));
    }
    return orders.filter(x => this.getDateTimeOnly(x.CreateDate) >= this.getDateTimeOnly(dateFrom) &&
      this.getDateTimeOnly(x.CreateDate) <= this.getDateTimeOnly(dateTo));
  }
  getProductsSalesForARange(dateFrom: string, dateTo: string, products: OrderProducts[]): OrderProducts[] {
    if (dateFrom === dateTo) {
      return products.filter(x => this.getDateTimeOnly(x.CreateDate) === this.getDateTimeOnly(dateFrom));
    }
    return products.filter(x => this.getDateTimeOnly(x.CreateDate) >= this.getDateTimeOnly(dateFrom) &&
      this.getDateTimeOnly(x.CreateDate) <= this.getDateTimeOnly(dateTo));
  }


  groupTopSelling(products: OrderProducts[]) {
    const results: TopSellingProduct[] = [];
    products.forEach(product => {
      const check = results.find(x => x.ProductId === product.ProductId);
      if (check) {
        const index = results.indexOf(check);
        results[index].Quantity = Number(results[index].Quantity) + Number(check.Quantity);
        results[index].Total = Number(results[index].Total) + Number(check.Total);
      } else {
        results.push(this.mapTopSelling(product));
      }
    });
    return results;
  }
  private getDateTimeOnly(date): number {
    return new Date(date.split(' ')[0]).getTime();
  }

  getDateDiffInDays(dateFrom: string, dateTo: string) {
    return new Date(dateTo).getDate() - new Date(dateFrom).getDate();
  }
  mapTopSelling(product: OrderProducts): TopSellingProduct {
    return {
      ProductId: product.ProductId,
      ProductName: product.ProductName,
      Times: product.ProductId,
      Quantity: product.Quantity,
      Total: product.subTotal
    };
  }
}
