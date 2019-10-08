import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../_models';

@Pipe({
  name: 'searchproductbycatergory'
})
export class SearchProductByCatergoryPipe implements PipeTransform {

  transform(products: Product[], val: any): any {

    if (!val) { return products; }
    if (!products) { return []; }
    return products.filter(x =>
      x.Name.toLocaleLowerCase().includes(val.toLocaleLowerCase()) ||
      (x.Description || '').includes(val) ||
      (x.Catergory || '').includes(val) ||
      (x.Brand || '').includes(val) ||
      x.Code.toLocaleLowerCase().includes(val.toLocaleLowerCase()));
  }

}
