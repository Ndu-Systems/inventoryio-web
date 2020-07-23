import { Image } from './image.model';
import { Product } from './product.model';

export interface Caterory {
    CatergoryId?: string;
    CompanyId: string;
    Name: string;
    Description: string;
    Parent: string;
    CatergoryType: string;
    ImageUrl: string;
    CreateDate?: string;
    CreateUserId: string;
    ModifyDate?: string;
    ModifyUserId: string;
    StatusId: number;
    Images?: Image[];
    Products?: Product[];
    Children?: Caterory[];
    ShowMenu?: boolean;
}
