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
    CreateUserId: string;
    ModifyDate?: string;
    ModifyUserId: string;
    StatusId: number;
}