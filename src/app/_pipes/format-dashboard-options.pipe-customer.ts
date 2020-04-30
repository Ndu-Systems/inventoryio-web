import { Pipe, PipeTransform } from '@angular/core';
import { OrderOptions } from '../_models/order.options.model';

@Pipe({
  name: 'formatDashboardOptionsCustomer'
})
export class FormatDashBoardOptionsPipeCustomer implements PipeTransform {

  transform(value: OrderOptions[] = []): any {
    let results = '';
    if (!value) {
      return results;
    }
    value.forEach((x, index) => {
      results += `${x.OptionName} : ${x.OptionValue}   `;
      if (index < value.length - 1) {
        results += ', ';
      }
    });
    return results;
  }

}
