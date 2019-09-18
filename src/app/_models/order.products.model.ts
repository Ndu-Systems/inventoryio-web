export interface OrderProducts {
    Id?: string;
    OrderId: string;
    ProductId: string;
    ProductName: string;
    Quantity: number;
    subTotal: number;
    CreateDate?: string;
    CreateUserId: string;
    ModifyDate?: string;
    ModifyUserId: string;
    StatusId: number;
}
