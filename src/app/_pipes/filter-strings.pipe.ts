import { Pipe, PipeTransform } from '@angular/core';
import { Orders } from '../_models';

@Pipe({
  name: 'filterStrings'
})
export class FilterStringsPipe implements PipeTransform {

  transform(value: Orders[], status: string): any {
    if (!status) {
      return value;
    }
    if (!value) {
      return [];
    }

    return value.filter(x => x.Status.toLowerCase() === status.toLowerCase());
  }

}
