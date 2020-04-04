import { Image } from './image.model';
import { Config } from './Config';

export interface Company {
    CompanyId?: string;
    Name: string;
    Description?: string;
    Type?: string;
    Shop?: string;
    Handler?: string;
    Website: string;
    TelephoneNumber: string;
    CreateDate?: string;
    CreateUserId: string;
    ModifyDate?: string;
    ModifyUserId: string;
    StatusId: string;
    Banner?: Image[];
    Logo?: Image[];
    Theme?: Config[];
    Shipping?: Config[];
}
