export interface OrderProducts {
    Id?: string;
    OrderId: string;
    ProductId: string;
    Quantity: number;
    subTotal: number;
    CreateDate?: string;
    CreateUserId: string;
    ModifyDate?: string;
    ModifyUserId: string;
    StatusId: number;
}
