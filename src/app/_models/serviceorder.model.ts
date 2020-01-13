import { Partner } from '.';

export interface ServiceOrder {
    ServiceOrderId?: string;
    Id?: number;
    CompanyId: string;
    ParntersId: string;
    OrderType: string;
    Total: number;
    Paid: number;
    Due: number;
    CreateDate?: string;
    CreateUserId: string;
    ModifyDate?: string;
    ModifyUserId: string;
    Status: string;
    StatusId: number;
    Customer?: Partner;
    // local
    Disable?: boolean;
    Touched?: boolean;
    Paying?: boolean;
    Payment?: number;
    CardClass?: string[];
}