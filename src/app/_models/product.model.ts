import { Brand } from './brand.model';
import { Caterory } from './caterory.model';
import { Image } from './image.model';

export interface Product {
    CompanyId?: string;
    ProductId: string;
    SupplierId?: string;
    BrandId: string;
    CatergoryId: string;
    Name: string;
    Description: string;
    UnitPrice: string;
    UnitCost: number;
    Code: string;
    SKU: string;
    TrackInventory: boolean;
    Quantity: number;
    LowStock: number;
    CreateDate: string;
    CreateUserId: string;
    ModifyDate: string;
    ModifyUserId: string;
    StatusId: string;
    Catergory?: Caterory;
    Brand?: Brand;
    QuantityAvailable?: number;
    images?: Image[];

}
