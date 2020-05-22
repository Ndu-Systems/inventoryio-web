import { Partner } from './partner.model';
import { Product } from './product.model';

export interface Orders {
    OrdersId?: string;
    OrderId?: number;
    CompanyId: string;
    ParntersId: string;
    ParntersEmail?: string;
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
    Customer?: any;
    Charges?: any;
    Products?: Product[];
    // local
    Disable?: boolean;
    Touched?: boolean;
    Paying?: boolean;
    Payment?: number;
    Show?: boolean;
    CardClass?: string[];


}
