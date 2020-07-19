import { Image } from './image.model';
import { Product } from './product.model';

export interface Productoptions {

    Id: string;
    ProductId: string;
    CompanyId: string;
    Name1: string;
    Name2: string;
    Name3: string;
    Name4: string;
    Name5: string;
    Value1: string;
    Value2: string;
    Value3: string;
    Value4: string;
    Value5: string;
    ImageUrl1: string;
    ImageUrl2: string;
    ImageUrl3: string;
    Quantity: number;
    CreateDate?: string;
    CreateUserId: string;
    ModifyDate?: string;
    ModifyUserId: string;
    StatusId: number;
    ngClass?: string[];
}



export const defaultOptions: Productoptions[] =
    [
        {
            Id: '',
            ProductId: '',
            CompanyId: '',
            Name1: 'Size',
            Name2: 'Colour',
            Name3: '',
            Name4: '',
            Name5: '',
            Value1: '',
            Value2: '',
            Value3: '',
            Value4: '',
            Value5: '',
            ImageUrl1: '',
            ImageUrl2: '',
            ImageUrl3: '',
            Quantity: null,
            CreateUserId: '',
            ModifyUserId: '',
            StatusId: 1
        }
    ];
