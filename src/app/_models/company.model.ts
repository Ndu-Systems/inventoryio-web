import { Image } from './image.model';
import { Config } from './Config';
import { Product } from './product.model';
import { Caterory } from './caterory.model';

export interface Company {

    CompanyId?: string;
    Name: string;
    Description?: string;
    Type?: string;
    Shop?: string;
    Handler?: string;
    Website: string;
    TelephoneNumber: string;
    Prefix?: string;
    ParentId?: string;
    CreateDate?: string;
    CreateUserId: string;
    ModifyDate?: string;
    ModifyUserId: string;
    StatusId: string;
    Banner?: Image[];
    Logo?: Image[];
    Theme?: Config[];
    Shipping?: Config[];
    Products?: Product[];
    Catergories?: Caterory[];
}
