export interface QouteProducts{
    Id?: string;
    QuotationId: string;
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