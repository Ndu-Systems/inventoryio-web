import { Image } from './image.model';

export interface Company {
    CompanyId?: string;
    Name: string;
    Website: string;
    TelephoneNumber: string;
    CreateDate?: string;
    CreateUserId: string;
    ModifyDate?: string;
    ModifyUserId: string;
    StatusId: string;
    Banner?: Image[];
}
