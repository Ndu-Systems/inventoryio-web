import { Pipe, PipeTransform } from '@angular/core';
import { Attribute } from '../_models/Attribute.model';

@Pipe({
  name: 'removeNoValueAttributes'
})
export class RemoveNoValuesAttributesPipe implements PipeTransform {

  transform(attributes: Attribute[]): any {
    if (!attributes) {
      return [];
    }

    return attributes.filter(x => x.Values && x.Values.length > 0);
  }

}
