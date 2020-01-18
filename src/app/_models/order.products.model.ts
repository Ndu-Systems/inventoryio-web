export interface OrderProducts {
    Id?: string;
    OrderId: string;
    ProductId: string;
    CompanyId: string;
    ProductName: string;
    UnitPrice: number;
    Quantity: number;
    subTotal: number;
    CreateDate?: string;
    CreateUserId: string;
    ModifyDate?: string;
    ModifyUserId: string;
    StatusId: number;
}
