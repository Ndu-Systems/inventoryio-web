

export interface Notification {
    Id: string;
    OtherId: string;
    Type: string;
    Message: string;
    Channel: string;
    CreateUserId: string;
    ModifyUserId: string;
    StatusId: number;
}

export const defoultProductprocess: Notification = {
    Id: '',
    OtherId: '',
    Type: '',
    Message: '',
    Channel: '',
    CreateUserId: '',
    ModifyUserId: '',
    StatusId: 1
}
