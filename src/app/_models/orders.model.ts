import { Partner } from './partner.model';
import { ItemOptions } from '.';
import { OrderOptions } from './order.options.model';

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
    // local
    Disable?: boolean;
    Touched?: boolean;
    Paying?: boolean;
    Payment?: number;
    options?: OrderOptions[];
    CardClass?: string[];


}
