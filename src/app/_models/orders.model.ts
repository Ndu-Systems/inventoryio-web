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
    StatusId: number;
    // local
    Disable?:boolean;
    Touched?:boolean;
    Paying?:boolean;
    Payment?:number;


}
