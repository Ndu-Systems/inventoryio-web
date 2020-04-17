import { OrderOptions } from './order.options.model';

export interface SellModel {
    items: Item[];
    total: number;
    companyId: string;
    charges?: Charges[];
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
