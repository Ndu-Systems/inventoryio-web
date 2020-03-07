import { Pipe, PipeTransform } from '@angular/core';
import { ItemOptions } from '../_models';

@Pipe({
  name: 'formatOptions'
})
export class FormatOptionsPipe implements PipeTransform {

  transform(value: ItemOptions[] = []): any {
    let results = '';
    value.forEach((x, index) => {
      results += `${x.optionName} : ${x.value}   `;
      if (index < value.length - 1) {
        results += ', ';
      }
    });
    return results;
  }

}
