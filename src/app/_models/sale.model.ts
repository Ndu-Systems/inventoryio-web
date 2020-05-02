import { OrderOptions } from './order.options.model';
import { Partner } from '.';

export interface SellModel {
    items: Item[];
    total: number;
    companyId: string;
    charges?: Charges[];
    Customer?: Partner;

}

export interface Item {
    prodcuId: string;
    companyId: string;
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
