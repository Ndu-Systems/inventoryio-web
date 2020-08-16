

export interface Productprocess {

    Id: string;
    ProductId: string;
    CompanyId: string;
    ProcessName: string;
    Started: string;
    AssignedUser: string;
    StartDatetime: string;
    FinishDatetime: string;
    NotifyCustomer: boolean;
    NotifyMessage: string;
    CreateUserId: string;
    ModifyUserId: string;
    StatusId: number;
}

export const defoultProductprocesses: Productprocess[] = [{
    Id: '',
    ProductId: '',
    CompanyId: '',
    ProcessName: '',
    Started: '',
    AssignedUser: '',
    StartDatetime: '',
    FinishDatetime: '',
    NotifyCustomer: false,
    NotifyMessage: '',
    CreateUserId: '',
    ModifyUserId: '',
    StatusId: 1
}
]