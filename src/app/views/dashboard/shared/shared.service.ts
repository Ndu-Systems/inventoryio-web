import { RolesService, PermissionsService } from 'src/app/_services';
import { Injectable } from '@angular/core';
import { SystemPermissionModel, Permission } from 'src/app/_models';
import { ProductPermissions, OrderPermissions, ConfigurationPermissions } from 'src/app/views/dashboard/shared';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  permissions: Permission[] = [];
  constructor(
    private permissionService: PermissionsService,
    private roleService: RolesService
  ) { }

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

  loadRolePermissions(roleId: string): SystemPermissionModel[] {
    const productPermissions = this.loadSystemPermissions();
    const permissionsForRole: SystemPermissionModel[] = [];
    this.roleService.getRolePermissions(roleId).subscribe(response => {
      this.permissions = response;
      productPermissions.forEach((item, index) => {
        if (this.permissions) {
          this.permissions.forEach((x, y) => {
            if (item.key.toLowerCase() === x.Name) {
              permissionsForRole.push(item);
            }
          });
        }
      });
    });
    return permissionsForRole;
  }

  loadCompanyPermissions(companyId, statusId): SystemPermissionModel[] {
    const systemPermissions = this.loadSystemPermissions();
    const permissionsForCompany: SystemPermissionModel[] = [];
    this.permissionService.getCompanyPermissions(companyId, statusId).subscribe(response => {
      this.permissions = response;
      systemPermissions.forEach((item, index) => {
        if (this.permissions) {
          this.permissions.forEach((x, y) => {
            if (item.key.toLowerCase() === x.Name) {
              permissionsForCompany.push(item);
            }
          });
        }
      });
    });
    return permissionsForCompany;
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
