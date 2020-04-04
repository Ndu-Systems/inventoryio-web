import { OrderOptions } from './order.options.model';

export interface SellModel {
    items: Item[];
    total: number;
    charges?: Charges[];
}

export interface Item {
    prodcuId: string;
    name: string;
    image?: string;
    price: number;
    subTotal?: number;
    quantity: number;
    options?: OrderOptions[];

}
export interface Charges {
    name?: string;
    line?: string;
    amount: any;
    key: string;

}

// export interface ItemOptions {
//     optionId: string;
//     productId?: string;
//     optionName: string;
//     valueId: number;
//     value: any;
// }

