export interface CreditNote {
    CreditnoteId?: string;
    CompanyId: string;
    OrderId: string;
    Total: number;
    Reason: string;
    OtherReason?: string;
    Notes?: string;
    CreateDate?: string;
    CreateUserId: string;
    ModifyDate?: string;
    ModifyUserId: string;
    StatusId: string;
}