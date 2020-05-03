import { Image } from './image.model';

export interface Partner {
    PartnerId: string;
    CompanyId: string;
    PartnerType: string;
    Name: string;
    Surname: string;
    CellphoneNumber: string;
    EmailAddress: string;
    Password: string;
    Address: string;
    CreateDate?: string;
    CreateUserId: string;
    ModifyDate?: string;
    ModifyUserId: string;
    StatusId: string;
    Images?: Image[];
}
