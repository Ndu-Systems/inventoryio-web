import { Image } from './image.model';
import { Product } from './product.model';
import { Company } from './company.model';

export interface Caterory {
    CatergoryId?: string;
    CompanyId?: string;
    Name: string;
    Description?: string;
    Parent?: string;
    CatergoryType?: string;
    ImageUrl?: string;
    CreateDate?: string;
    CreateUserId?: string;
    ModifyDate?: string;
    ModifyUserId?: string;
    StatusId?: number;
    Images?: Image[];
    Products?: Product[];
    Children?: Caterory[];
    ParentCaterory?: Caterory;
    Company?: Company;
    ShowMenu?: boolean;
    Label?: string;
    Handler?: string;
    Class?: string[];
}
