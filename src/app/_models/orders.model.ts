import { Partner } from './partner.model';

export interface Orders {
    OrdersId?: string;
    OrderId?: number;
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
    Charges?: any;
    // local
    Disable?: boolean;
    Touched?: boolean;
    Paying?: boolean;
    Payment?: number;
    CardClass?: string[];


}
