import { Pipe, PipeTransform } from '@angular/core';
import { SearchQuery } from '../_models/serach.query.model';

@Pipe({
  name: 'formatSearchList'
})
export class FormatSearchListPipe implements PipeTransform {

  transform(value: SearchQuery[] = []): any {
    let results: SearchQuery[][] = [];
    if (!value) {
      return results;
    }
    value.forEach((x, index) => {
      if (!results) {

      }

    });
    return results;
  }

}
