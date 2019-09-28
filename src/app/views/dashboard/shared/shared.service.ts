import { Injectable } from '@angular/core';
import { SystemPermissionModel } from 'src/app/_models';
import { ProductPermissions, OrderPermissions, ConfigurationPermissions } from 'src/app/views/dashboard/shared';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  loadSystemPermissions(): SystemPermissionModel[] {
    const systemPermissions: SystemPermissionModel[] = [];
    const productPermissions = this.loadProductPermissions();
    productPermissions.forEach((item, index) => {
      systemPermissions.push(item);
    });
    const ordersPermissions = this.loadOrderPermissions();
    ordersPermissions.forEach((item, index) => {
      systemPermissions.push(item);
    });
    const configurationPermissions = this.loadConfigurationPermissions();
    configurationPermissions.forEach((item, index) => {
      systemPermissions.push(item);
    });
    return systemPermissions;
  }

  loadProductPermissions(): SystemPermissionModel[] {
    const productPermissions: SystemPermissionModel[] = [
      {
        key: ProductPermissions.CAN_ADD_PRODUCTS.key,
        friendlyName: ProductPermissions.CAN_ADD_PRODUCTS.friendlyName,
        desc: ProductPermissions.CAN_ADD_PRODUCTS.desc
      },
      {
        key: ProductPermissions.CAN_SELL_PRODUCTS.key,
        friendlyName: ProductPermissions.CAN_SELL_PRODUCTS.friendlyName,
        desc: ProductPermissions.CAN_SELL_PRODUCTS.desc
      },
      {
        key: ProductPermissions.CAN_ORDER_PRODUCTS.key,
        friendlyName: ProductPermissions.CAN_ORDER_PRODUCTS.friendlyName,
        desc: ProductPermissions.CAN_ORDER_PRODUCTS.desc
      },
      {
        key: ProductPermissions.CAN_READ_PRODUCTS.key,
        friendlyName: ProductPermissions.CAN_READ_PRODUCTS.friendlyName,
        desc: ProductPermissions.CAN_READ_PRODUCTS.desc
      },
    ];
    return productPermissions;
  }

  loadOrderPermissions(): SystemPermissionModel[] {
    const ordersPermissions: SystemPermissionModel[] = [
      {
        key: OrderPermissions.CAN_READ_ORDERS.key,
        friendlyName: OrderPermissions.CAN_READ_ORDERS.friendlyName,
        desc: OrderPermissions.CAN_READ_ORDERS.desc
      },
      {
        key: OrderPermissions.CAN_PAY_ORDERS.key,
        friendlyName: OrderPermissions.CAN_PAY_ORDERS.friendlyName,
        desc: OrderPermissions.CAN_PAY_ORDERS.desc
      },
      {
        key: OrderPermissions.CAN_PRINT_ORDERS.key,
        friendlyName: OrderPermissions.CAN_PRINT_ORDERS.friendlyName,
        desc: OrderPermissions.CAN_PRINT_ORDERS.desc
      },
    ];
    return ordersPermissions;
  }

   loadConfigurationPermissions(): SystemPermissionModel[] {
    const configurationPermissions: SystemPermissionModel[] = [
      {
        key: ConfigurationPermissions.CAN_CONFIGURE.key,
        friendlyName: ConfigurationPermissions.CAN_CONFIGURE.friendlyName,
        desc: ConfigurationPermissions.CAN_CONFIGURE.desc
      },
    ];
    return configurationPermissions;
  }

}
