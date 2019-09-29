export interface Role {
    RoleId?: string;
    CompanyId: string;
    Name: string;
    CreateDate?: string;
    CreateUserId: string;
    ModifyDate?: string;
    ModifyUserId: string;
    StatusId: number;
}

export interface RolePermission {
  RoleId?: string;
  PermissionId: string;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number;
}
