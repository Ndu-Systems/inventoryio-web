import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'configurationFilterPipe'
})
export class ConfigurationFilterPipe implements PipeTransform {

  transform(items: any[], val: any): any {

    if (!val) {
      return items;
    }
    if (!items) { return []; }
    return items.filter(x => x.Name.toLocaleLowerCase().includes(val.toLocaleLowerCase()));
   }

}
