import { Brand } from './brand.model';
import { Caterory } from './caterory.model';

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
    Quantity: number;
    LowStock: string;
    CreateDate: string;
    CreateUserId: string;
    ModifyDate: string;
    ModifyUserId: string;
    StatusId: string;
    Catergory?: Caterory;
    Brand?: Brand;
    QuantityAvailable?: number;
    Images?;

}
