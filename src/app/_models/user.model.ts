import { Role, Store, Company, Permission, SystemPermissionModel } from 'src/app/_models';
// import { Company } from './company.model';


export interface User {
  UserId?: string;
  Email: string;
  Name: string;
  UserType?: string;
  Surname: string;
  CellphoneNumber: string;
  Address?: string;
  Password: string;
  CompanyId?: string;
  CompanyName?: string;
  RoleId?: number;
  CreateDate?: string;
  CreateUserId?: string;
  ModifyDate?: string;
  ModifyUserId?: string;
  NewPassword?: string;
  ConfirmPassword?: string;
  StatusId: any;
  Company?: Company;
  DP?: any;
  Stores?: Store[];
  Role?: Role;
  Permissions?: SystemPermissionModel[];
  SystemRole?: string;
  SecurityToken?: string;
}

// add user to a store
export interface UserStoreModel {
  UserId: string;
  StoreId: string;
  CreateUserId: string;
  ModifyUserId: string;
  StatusId: number;
}

// add user to a role
export interface UserRoleModel {
  UserId: string;
  RoleId: string;
  CreateUserId: string;
  ModifyUserId: string;
  StatusId: number;
}

