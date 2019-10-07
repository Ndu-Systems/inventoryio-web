import { Role, Store } from 'src/app/_models';
import { Company } from './company.model';


export interface User {
  UserId?: string;
  Email: string;
  Name: string;
  Surname: string;
  CellphoneNumber: string;
  Password: string;
  CompanyId: string;
  RoleId: number;
  CreateDate?: string;
  CreateUserId?: string;
  ModifyDate?: string;
  ModifyUserId?: string;
  NewPassword?: string;
  ConfirmPassword?: string;
  StatusId: number;
  Company?: Company;
  Dp?: string;
  Stores?: Store[];
  Roles?: Role[];
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

