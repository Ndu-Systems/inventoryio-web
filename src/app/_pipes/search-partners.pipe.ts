import { Pipe, PipeTransform } from '@angular/core';
import { Product, Partner } from '../_models';

@Pipe({
  name: 'searchpartner'
})
export class SearchPartnerPipe implements PipeTransform {

  transform(partners: Partner[], val: any): any {

    if (!val) { return partners; }
    if (!partners) { return []; }
    return partners.filter(x =>
      x.Name.toLocaleLowerCase().includes(val.toLocaleLowerCase()) ||
      (x.PartnerType).includes(val.toLocaleLowerCase()));
  }

}
