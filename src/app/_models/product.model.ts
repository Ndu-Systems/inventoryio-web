import { Brand } from './brand.model';
import { Caterory } from './caterory.model';
import { Image } from './image.model';
import { Attribute } from './Attribute.model';
import { Productoptions } from './productoptions.model';
import { Productprocess } from './productproces.model';

export interface Product {
    CompanyId?: string;
    ProductId: string;
    SupplierId?: string;
    BrandId: string;
    CatergoryId: string;
    Name: string;
    ProductAvailability?: string;
    PreparingDays?: number;
    Description: string;
    UnitPrice: any;
    UnitCost: number;
    Code: any;
    SKU: string;
    TrackInventory: boolean;
    Quantity: number;
    LowStock: number;
    CreateDate: string;
    CreateUserId: string;
    ModifyDate: string;
    ModifyUserId: string;
    StatusId: number;
    Catergory?: Caterory;
    Brand?: Brand;
    QuantityAvailable?: number;
    QuantitySelected?: number;
    Images?: Image[];
    Attributes?: Attribute[];
    Productoptions?: Productoptions[];
    Productprocesses?: Productprocess[];
    Error?: string;

}
