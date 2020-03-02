export interface AttributeItem {
    Id: string;
    AttributeId: string;
    AttributeValue: string;
    AttributePrice?: any;
    CreateDate?: string;
    CreateUserId: string;
    ModifyDate?: string;
    ModifyUserId: string;
    StatusId: string;
}

export interface Attribute {
    AttributeId: string;
    Name: string;
    AttributeType: string;
    CompanyId: string;
    ProductId: string;
    Shop: string;
    CreateDate?: string;
    CreateUserId: string;
    ModifyDate?: string;
    ModifyUserId: string;
    StatusId: string;
    Values?: AttributeItem[];
}