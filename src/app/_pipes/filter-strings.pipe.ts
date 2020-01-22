import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterStrings'
})
export class FilterStringsPipe implements PipeTransform {

  transform(value: string[], val): any {
    return value.filter(x => x === val);
  }

}
