import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../_models';

@Pipe({
  name: 'userFilterPipe'
})
export class UserFilterPipe implements PipeTransform {

  transform(users: User[], val: any): any[] {
    if (!val) {
      return users;
    }
    if (!users) { return []; }
    return users.filter(u => u.Name.toLocaleLowerCase().includes(val.toLocaleLowerCase())
    || (u.Surname || '').includes(val)
    || (u.Email || '').includes(val)
    || (u.CellphoneNumber || '').includes(val));
  }

}
