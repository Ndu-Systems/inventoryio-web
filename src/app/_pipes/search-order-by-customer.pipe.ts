import { Pipe, PipeTransform } from '@angular/core';
import { Orders } from '../_models/orders.model';

@Pipe({
  name: 'searchorderbucustomer'
})
export class SearchOrderByCustomerPipe implements PipeTransform {

  transform(products: Orders[], val: any): any {

    if (!val) { return products; }
    if (!products) { return []; }
    return products.filter(x =>
      (x.Customer &&
        x.Customer.Name || '').toLocaleLowerCase().includes(val.toLocaleLowerCase()) ||
      x.OrderId === val);
  }

}
