import { Injectable } from '@angular/core';
import { Orders } from 'src/app/_models';

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
  private getDateTimeOnly(date): number {
    return new Date(date.split(' ')[0]).getTime();
  }
}
