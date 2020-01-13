export interface ServiceOrderProducts{
    Id?: string;
    ServiceOrderId: string;
    ProductId: string;
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