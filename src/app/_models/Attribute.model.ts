export interface AttributeItem {
    Id?: number;
    AttributeId?: string;
    AttributeValue: string;
    AttributePrice?: any;
    AttributeQuantity?: any;
    CreateDate?: string;
    CreateUserId: string;
    ModifyDate?: string;
    ModifyUserId: string;
    StatusId: number;
}

export interface Attribute {
    AttributeId?: string;
    Name: string;
    AttributeType: string;
    CompanyId: string;
    ProductId: string;
    Shop: number;
    CreateDate?: string;
    CreateUserId: string;
    ModifyDate?: string;
    ModifyUserId: string;
    StatusId: number;
    Values?: AttributeItem[];


    AttributePrice?: any;
    AttributeValue?: any;
    AttributeQuantity?: any;
}